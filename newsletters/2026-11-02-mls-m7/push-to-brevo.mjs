#!/usr/bin/env node
/**
 * Creates M7 (Merz pilot, before Check-In 2) of The Mental Load Shift in Brevo as a DRAFT campaign.
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

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));
const c = cfg.campaign;

const missing = [];
if (!cfg.sender.email) missing.push('sender.email');
if (!c.listIds.length) missing.push('campaign.listIds');
if (SCHEDULE && !c.scheduledAt) missing.push('campaign.scheduledAt');
if (SCHEDULE && c.scheduledAt && new Date(c.scheduledAt) < new Date()) missing.push('campaign.scheduledAt is in the past');
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

let html = await readFile(new URL('./campaign-m7.html', import.meta.url), 'utf8');
for (const [t, v] of Object.entries(cfg.font)) if (v) html = html.split(t).join(v);
const checks = [
  [!/REPLACE-WITH/.test(html), 'unresolved REPLACE-WITH token. Fill the font URLs or delete the @font-face block.'],
  [!html.includes('data:image'), 'inline data URI found'],
  [html.includes('{{contact.VORNAME}}'), 'greeting tag {{contact.VORNAME}} missing'],
  [!html.includes('FIRSTNAME'), 'use {{contact.VORNAME}}, not FIRSTNAME'],
  [!html.includes('Rosa Di Donna') && !html.includes('Boeckle'), 'use Rosaria Di Donna and Andrea Böckle'],
  [html.includes('familymind.ai/mental-load-score/de'), 'quiz link missing'],
  [html.includes('MENTALLOADSHIFT'), 'activation code missing'],
  [html.includes('https://app.familymind.ai/'), 'web app button missing'],
  [html.includes('4. November'), 'date missing'],
  [(html.match(/<img /g) || []).length === c.expectImgs, `expected ${c.expectImgs} images`],
];
const failed = checks.filter(([ok]) => !ok).map(([, m]) => m);
if (failed.length) { console.error('Validation failed:\n  ' + failed.join('\n  ')); process.exit(1); }

const body = {
  name: c.name, subject: c.subject, previewText: c.previewText,
  sender: { name: c.senderName, email: cfg.sender.email },
  replyTo: cfg.sender.replyTo,
  htmlContent: html,
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
if (!res.ok) { console.error(`Brevo returned ${res.status} ${text}`); process.exit(1); }
console.log(`M7 created as draft, campaign id ${JSON.parse(text).id}. Send a test before anyone sends.`);
