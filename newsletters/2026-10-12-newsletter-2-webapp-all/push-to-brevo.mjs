#!/usr/bin/env node
/**
 * Creates Newsletter 2 (web app for everyone) in Brevo as two DRAFT campaigns, DE and EN.
 *
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --schedule
 *
 * Never sends. Without --schedule the campaigns stay unscheduled; Maha schedules after Rosa signs off.
 */
import { readFile } from 'node:fs/promises';

const API = 'https://api.brevo.com/v3';
const KEY = process.env.BREVO_API_KEY;
const SCHEDULE = process.argv.includes('--schedule');
const EXPECT_IMGS = 5; // logo, header banner, home screen, E4 banner, Rosa
const LANGS = ['de', 'en'];

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));

const missing = [];
for (const scope of ['shared', 'de', 'en']) for (const [t, v] of Object.entries(cfg[scope])) if (!v) missing.push(`${scope}: ${t}`);
for (const l of LANGS) for (const [t, v] of Object.entries(cfg.copy[l])) if (!v) missing.push(`copy.${l}: price/offer line`);
if (!cfg.sender.email) missing.push('sender.email');
for (const l of LANGS) {
  if (!cfg.campaign[l].listIds.length) missing.push(`campaign.${l}.listIds`);
  if (SCHEDULE && !cfg.campaign[l].scheduledAt) missing.push(`campaign.${l}.scheduledAt`);
}
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

async function buildHtml(l) {
  let html = await readFile(new URL(`./campaign-${l}.html`, import.meta.url), 'utf8');
  const map = { ...cfg.shared, ...cfg[l], ...cfg.copy[l] };
  for (const [t, v] of Object.entries(cfg.font)) if (v) map[t] = v;
  for (const [t, v] of Object.entries(map)) html = html.split(t).join(v);
  const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
  if (left) throw new Error(`${l}: unresolved tokens ${[...new Set(left)].join(', ')}. Fill them, or for the font delete the @font-face block.`);
  if (/\[(Preis oder Angebot|price or offer)\]/.test(html)) throw new Error(`${l}: price/offer placeholder still in copy`);
  if (html.includes('data:image')) throw new Error(`${l}: inline data URI found, Gmail strips these`);
  const imgs = (html.match(/<img /g) || []).length;
  if (imgs !== EXPECT_IMGS) throw new Error(`${l}: expected ${EXPECT_IMGS} images, found ${imgs}`);
  const kb = Buffer.byteLength(html, 'utf8') / 1024;
  if (kb > 100) console.warn(`  warning: ${l} is ${kb.toFixed(0)}KB, Gmail clips above ~102KB`);
  return html;
}

async function createCampaign(l) {
  const c = cfg.campaign[l];
  const body = {
    name: c.name, subject: c.subject, previewText: c.previewText,
    sender: { name: cfg.sender.name, email: cfg.sender.email },
    replyTo: cfg.sender.replyTo,
    htmlContent: await buildHtml(l),
    recipients: { listIds: c.listIds, exclusionListIds: c.exclusionListIds },
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

console.log(SCHEDULE ? 'Creating campaigns (scheduled)…' : 'Creating campaigns (unscheduled drafts)…');
for (const l of LANGS) await createCampaign(l);
console.log('Done. Open each campaign in Brevo, send a test to yourself, then hand to Maha for scheduling.');
