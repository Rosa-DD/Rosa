#!/usr/bin/env node
/**
 * Creates the "familymind is taking a short break" service notice in Brevo as two DRAFT campaigns, DE and EN.
 *
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --schedule
 *
 * Never sends. Without --schedule the campaigns stay unscheduled.
 */
import { readFile } from 'node:fs/promises';

const API = 'https://api.brevo.com/v3';
const KEY = process.env.BREVO_API_KEY;
const SCHEDULE = process.argv.includes('--schedule');
const LANGS = ['de', 'en'];

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));

const missing = [];
if (!cfg.sender.email) missing.push('sender.email');
for (const l of LANGS) {
  if (!cfg.campaign[l].listIds.length) missing.push(`campaign.${l}.listIds`);
  if (SCHEDULE && !cfg.campaign[l].scheduledAt) missing.push(`campaign.${l}.scheduledAt`);
}
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

async function buildHtml(l) {
  let html = await readFile(new URL(`./campaign-${l}.html`, import.meta.url), 'utf8');
  for (const [t, v] of Object.entries(cfg.font)) if (v) html = html.split(t).join(v);
  const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
  if (left) throw new Error(`${l}: unresolved tokens ${[...new Set(left)].join(', ')}. Fill the font URLs or delete the @font-face block.`);
  if (html.includes('data:image')) throw new Error(`${l}: inline data URI found, Gmail strips these`);
  if (html.includes('{{name}}')) throw new Error(`${l}: use {{contact.FIRSTNAME}}, not {{name}}`);
  if (!html.includes('{{contact.FIRSTNAME}}')) throw new Error(`${l}: first-name tag missing`);
  const imgs = (html.match(/<img /g) || []).length;
  if (imgs !== 1) throw new Error(`${l}: expected 1 image (logo), found ${imgs}`);
  return html;
}

async function createCampaign(l) {
  const c = cfg.campaign[l];
  const body = {
    name: c.name, subject: c.subject, previewText: c.previewText,
    sender: { name: l === 'en' ? cfg.sender.nameEn : cfg.sender.name, email: cfg.sender.email },
    replyTo: cfg.sender.replyTo,
    htmlContent: await buildHtml(l),
    recipients: { listIds: c.listIds, ...(c.exclusionListIds.length ? { exclusionListIds: c.exclusionListIds } : {}) },
    inlineImageActivation: false,
  };
  if (SCHEDULE) body.scheduledAt = c.scheduledAt;
  const res = await fetch(`${API}/emailCampaigns`, {
    method: 'POST',
    headers: { 'api-key': KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${l}: Brevo returned ${res.status} ${text}`);
  console.log(`  ${l.toUpperCase()} created as draft, campaign id ${JSON.parse(text).id}`);
}

for (const l of LANGS) await buildHtml(l); // validate both before creating either
console.log(SCHEDULE ? 'Creating campaigns (scheduled)…' : 'Creating campaigns (unscheduled drafts)…');
for (const l of LANGS) await createCampaign(l);
console.log('Done. Send a test to yourself from each campaign before anyone sends.');
