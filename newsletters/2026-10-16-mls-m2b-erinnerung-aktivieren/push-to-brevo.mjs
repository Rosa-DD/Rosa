#!/usr/bin/env node
/**
 * Creates M2b (Mental Load Shift, Merz pilot, activation reminder) in Brevo as a DRAFT.
 *
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
 *   BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs --schedule
 *
 * Never sends. Without --schedule the campaign stays unscheduled.
 */
import { readFile } from 'node:fs/promises';

const API = 'https://api.brevo.com/v3';
const KEY = process.env.BREVO_API_KEY;
const SCHEDULE = process.argv.includes('--schedule');

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));

const missing = [];
if (!cfg.sender.email) missing.push('sender.email');
if (!cfg.campaign.listIds.length) missing.push('campaign.listIds');
if (SCHEDULE && !cfg.campaign.scheduledAt) missing.push('campaign.scheduledAt');
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

let html = await readFile(new URL('./campaign-m2b.html', import.meta.url), 'utf8');
for (const [t, v] of Object.entries(cfg.font)) if (v) html = html.split(t).join(v);

const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
if (left) throw new Error(`unresolved tokens ${[...new Set(left)].join(', ')}. Fill the font URLs or delete the @font-face block.`);
if (html.includes('data:image')) throw new Error('inline data URI found, Gmail strips these');
if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) throw new Error('name spelling: use Rosaria Di Donna and Andrea Böckle');
if (!html.includes('MENTALLOADSHIFT')) throw new Error('premium code missing from step 3');
if (!html.includes('21. Oktober')) throw new Error('Merz start date missing');
const imgs = (html.match(/<img /g) || []).length;
if (imgs !== 4) throw new Error(`expected 4 images (logo, App Store, Google Play, Rosaria), found ${imgs}`);

const c = cfg.campaign;
const body = {
  name: c.name, subject: c.subject, previewText: c.previewText,
  sender: { name: cfg.sender.name, email: cfg.sender.email },
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
if (!res.ok) throw new Error(`Brevo returned ${res.status} ${text}`);
console.log(`M2b created as draft, campaign id ${JSON.parse(text).id}`);
