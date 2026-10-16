#!/usr/bin/env node
/**
 * Creates the "Folien Check-In 1" email for the Mental Load Shift open cohort in Brevo as a DRAFT,
 * with the Check-In 1 slide deck PDF attached via attachmentUrl.
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
if (!cfg.attachmentUrl) missing.push('attachmentUrl');
if (!cfg.sender.email) missing.push('sender.email');
if (!cfg.campaign.listIds.length) missing.push('campaign.listIds');
if (SCHEDULE && !cfg.campaign.scheduledAt) missing.push('campaign.scheduledAt');
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

if (!/^https:\/\/.+\.pdf(\?.*)?$/i.test(cfg.attachmentUrl)) {
  console.error('attachmentUrl must be an absolute https URL ending in .pdf');
  process.exit(1);
}

// Brevo fetches the attachment itself, so it must be publicly reachable. Check it before pushing.
const head = await fetch(cfg.attachmentUrl, { method: 'HEAD' });
if (!head.ok) { console.error(`attachmentUrl not reachable: HTTP ${head.status}`); process.exit(1); }
const size = Number(head.headers.get('content-length') || 0);
if (size) console.log(`  attachment ${(size / 1024 / 1024).toFixed(1)} MB`);
if (size > 4 * 1024 * 1024) console.warn('  warning: attachment is over 4 MB. Check the attachment limit for this Brevo account before sending.');

let html = await readFile(new URL('./campaign-o-slides.html', import.meta.url), 'utf8');
for (const [t, v] of Object.entries(cfg.font)) if (v) html = html.split(t).join(v);

const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
if (left) throw new Error(`unresolved tokens ${[...new Set(left)].join(', ')}. Fill the font URLs or delete the @font-face block.`);
if (html.includes('data:image')) throw new Error('inline data URI found, Gmail strips these');
if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) throw new Error('name spelling: use Rosaria Di Donna and Andrea Böckle');
if (!html.includes('im Anhang')) throw new Error('attachment wording missing from the copy');
const imgs = (html.match(/<img /g) || []).length;
if (imgs !== 1) throw new Error(`expected 1 image (logo), found ${imgs}`);

const c = cfg.campaign;
const body = {
  name: c.name, subject: c.subject, previewText: c.previewText,
  sender: { name: cfg.sender.name, email: cfg.sender.email },
  replyTo: cfg.sender.replyTo,
  htmlContent: html,
  attachmentUrl: cfg.attachmentUrl,
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
console.log(`Created as draft, campaign id ${JSON.parse(text).id}. Open it in Brevo and confirm the PDF shows under Attachments.`);
