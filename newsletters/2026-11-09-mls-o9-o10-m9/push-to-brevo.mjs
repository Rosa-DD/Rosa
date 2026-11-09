#!/usr/bin/env node
/**
 * Creates O9, O10 (open cohort) and M9 (Merz pilot) of The Mental Load Shift in Brevo as DRAFT campaigns.
 *
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs                 # all three, unscheduled
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --only=o9       # one or more: --only=o10,m9
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --schedule      # applies scheduledAt
 *
 * Never sends.
 */
import { readFile } from 'node:fs/promises';

const API = 'https://api.brevo.com/v3';
const KEY = process.env.BREVO_API_KEY;
const SCHEDULE = process.argv.includes('--schedule');
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));
const ids = Object.keys(cfg.campaigns).filter(id => !only.length || only.includes(id));
if (!ids.length) { console.error('Nothing selected. Use --only=o9,o10,m9 or omit.'); process.exit(1); }

const missing = [];
if (!cfg.sender.email) missing.push('sender.email');
for (const id of ids) {
  for (const [t, v] of Object.entries(cfg[id] || {})) if (!v) missing.push(`${id}: ${t}`);
  const c = cfg.campaigns[id];
  if (!c.listIds.length) missing.push(`campaigns.${id}.listIds`);
  if (SCHEDULE && !c.scheduledAt) missing.push(`campaigns.${id}.scheduledAt`);
  if (SCHEDULE && c.scheduledAt && new Date(c.scheduledAt) < new Date()) missing.push(`campaigns.${id}.scheduledAt is in the past`);
}
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

async function build(id) {
  const c = cfg.campaigns[id];
  let html = await readFile(new URL('./' + c.file, import.meta.url), 'utf8');
  const map = { ...(cfg[id] || {}) };
  for (const [t, v] of Object.entries(cfg.font)) if (v) map[t] = v;
  for (const [t, v] of Object.entries(map)) html = html.split(t).join(v);
  const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
  if (left) throw new Error(`${id}: unresolved tokens ${[...new Set(left)].join(', ')}. Fill them, or for the font delete the @font-face block.`);
  if (html.includes('data:image')) throw new Error(`${id}: inline data URI found`);
  if (!html.includes('{{contact.VORNAME}}')) throw new Error(`${id}: greeting tag {{contact.VORNAME}} missing`);
  if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) throw new Error(`${id}: use Rosaria Di Donna and Andrea Böckle`);
  const body = html.replace(/<style[\s\S]*?<\/style>/g, '');
  for (const s of c.mustInclude) if (!body.includes(s)) throw new Error(`${id}: expected content missing: ${s}`);
  for (const s of c.mustNotInclude) if (body.includes(s)) throw new Error(`${id}: wrong cohort content found: ${s}`);
  const imgs = (html.match(/<img /g) || []).length;
  if (imgs !== c.expectImgs) throw new Error(`${id}: expected ${c.expectImgs} images, found ${imgs}`);
  return html;
}

for (const id of ids) await build(id); // validate all before creating any

for (const id of ids) {
  const c = cfg.campaigns[id];
  const body = {
    name: c.name, subject: c.subject, previewText: c.previewText,
    sender: { name: c.senderName, email: cfg.sender.email },
    replyTo: cfg.sender.replyTo,
    htmlContent: await build(id),
    recipients: { listIds: c.listIds },
    inlineImageActivation: false,
  };
  if (SCHEDULE) body.scheduledAt = c.scheduledAt;
  const res = await fetch(`${API}/emailCampaigns`, {
    method: 'POST',
    headers: { 'api-key': KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${id}: Brevo returned ${res.status} ${text}`);
  console.log(`  ${id.toUpperCase()} created as draft, campaign id ${JSON.parse(text).id}`);
}
console.log('Done. Send a test from each campaign before anyone sends.');
