#!/usr/bin/env node
/**
 * Creates M10 (Merz pilot, before Check-In 3) of The Mental Load Shift in Brevo as a DRAFT campaign.
 *
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --schedule
 *
 * Never sends.
 */
import { readFile } from 'node:fs/promises';

const API = 'https://api.brevo.com/v3';
const KEY = process.env.BREVO_API_KEY;
const SCHEDULE = process.argv.includes('--schedule');
const EXPECT_IMGS = 2;

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));
const c = cfg.campaign;

const missing = [];
for (const [t, v] of Object.entries(cfg.m10)) if (!v) missing.push('m10: ' + t);
if (!cfg.sender.email) missing.push('sender.email');
if (!c.listIds.length) missing.push('campaign.listIds');
if (SCHEDULE && !c.scheduledAt) missing.push('campaign.scheduledAt');
if (SCHEDULE && c.scheduledAt && new Date(c.scheduledAt) < new Date()) missing.push('campaign.scheduledAt is in the past');
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

let html = await readFile(new URL('./campaign-m10.html', import.meta.url), 'utf8');
const map = { ...cfg.m10 };
for (const [t, v] of Object.entries(cfg.font)) if (v) map[t] = v;
for (const [t, v] of Object.entries(map)) html = html.split(t).join(v);

const fail = m => { console.error('M10: ' + m); process.exit(1); };
const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
if (left) fail(`unresolved tokens ${[...new Set(left)].join(', ')}. Fill them, or for the font delete the @font-face block.`);
const body = html.replace(/<style[\s\S]*?<\/style>/g, '');
if (html.includes('data:image')) fail('inline data URI found');
if (!html.includes('{{contact.VORNAME}}')) fail('greeting tag {{contact.VORNAME}} missing');
if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) fail('use Rosaria Di Donna and Andrea Böckle');
for (const s of ['Mittwoch, 18. November, 12:30 bis 14:00 Uhr', 'Merz Lifecare', 'alt="Merz"']) if (!body.includes(s)) fail('expected content missing: ' + s);
for (const s of ['Freitag', '13. November', 'Zoom']) if (body.includes(s)) fail('open cohort content found: ' + s);
const imgs = (html.match(/<img /g) || []).length;
if (imgs !== EXPECT_IMGS) fail(`expected ${EXPECT_IMGS} images, found ${imgs}`);

const req = {
  name: c.name, subject: c.subject, previewText: c.previewText,
  sender: { name: c.senderName, email: cfg.sender.email },
  replyTo: cfg.sender.replyTo,
  htmlContent: html,
  recipients: { listIds: c.listIds },
  inlineImageActivation: false,
};
if (SCHEDULE) req.scheduledAt = c.scheduledAt;
const res = await fetch(`${API}/emailCampaigns`, {
  method: 'POST',
  headers: { 'api-key': KEY, 'content-type': 'application/json', accept: 'application/json' },
  body: JSON.stringify(req),
});
const text = await res.text();
if (!res.ok) fail(`Brevo returned ${res.status} ${text}`);
console.log(`  M10 created as draft, campaign id ${JSON.parse(text).id}`);
console.log('Done. Send a test to yourself before anyone sends.');
