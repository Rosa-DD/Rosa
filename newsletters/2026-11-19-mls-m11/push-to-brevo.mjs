#!/usr/bin/env node
/**
 * Creates M11 (Merz pilot, day after Check-In 3) in Brevo as a DRAFT campaign, with the slides attached.
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
 * Never sends.
 */
import { readFile } from 'node:fs/promises';

const KEY = process.env.BREVO_API_KEY;
const SCHEDULE = process.argv.includes('--schedule');
if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));
const c = cfg.campaign;
const fail = m => { console.error('M11: ' + m); process.exit(1); };

const missing = [];
for (const [t, v] of Object.entries(cfg.m11)) if (!v) missing.push('m11: ' + t);
if (!c.attachmentUrl) missing.push('campaign.attachmentUrl (slides PDF)');
if (!cfg.sender.email) missing.push('sender.email');
if (SCHEDULE && !c.scheduledAt) missing.push('campaign.scheduledAt');
if (missing.length) fail('replacements.json is incomplete:\n  ' + missing.join('\n  '));

let html = await readFile(new URL('./campaign-m11.html', import.meta.url), 'utf8');
const map = { ...cfg.m11 };
for (const [t, v] of Object.entries(cfg.font)) if (v) map[t] = v;
for (const [t, v] of Object.entries(map)) html = html.split(t).join(v);

const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
if (left) fail(`unresolved tokens ${[...new Set(left)].join(', ')}. For the font, delete the @font-face block.`);
if (html.includes('background-color:#DFFD6E; color:#1A140F; font-weight:bold; padding:0 4px;')) fail('lime [placeholder] copy still in the email. Replace with Modul 3 text first.');
const body = html.replace(/<style[\s\S]*?<\/style>/g, '');
if (!html.includes('{{contact.VORNAME}}')) fail('greeting tag missing');
if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) fail('use Rosaria Di Donna and Andrea Böckle');
for (const s of ['3. März', 'Merz Lifecare', 'bookings.cloud.microsoft', 'forms.cloud.microsoft', 'angehängt']) if (!body.includes(s)) fail('expected content missing: ' + s);
for (const s of ['heute', '11. Dezember', '11.12']) if (body.includes(s)) fail('wrong time context found: ' + s);
if ((html.match(/<img /g) || []).length !== 2) fail('expected 2 images (both logos)');

const req = {
  name: c.name, subject: c.subject, previewText: c.previewText,
  sender: { name: c.senderName, email: cfg.sender.email },
  replyTo: cfg.sender.replyTo, htmlContent: html,
  recipients: { listIds: c.listIds },
  attachmentUrl: c.attachmentUrl,
  inlineImageActivation: false,
};
if (SCHEDULE) req.scheduledAt = c.scheduledAt;
const res = await fetch('https://api.brevo.com/v3/emailCampaigns', {
  method: 'POST',
  headers: { 'api-key': KEY, 'content-type': 'application/json', accept: 'application/json' },
  body: JSON.stringify(req),
});
const text = await res.text();
if (!res.ok) fail(`Brevo returned ${res.status} ${text}`);
console.log(`M11 created as draft, campaign id ${JSON.parse(text).id}. Send a test before anyone sends.`);
