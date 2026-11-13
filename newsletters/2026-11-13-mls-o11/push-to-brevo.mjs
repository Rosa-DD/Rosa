#!/usr/bin/env node
/**
 * Creates O11 (open cohort, after Check-In 3) of The Mental Load Shift in Brevo as a DRAFT campaign.
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
const EXPECT_IMGS = 1;
const FEEDBACK = 'forms.cloud.microsoft/Pages/ResponsePage.aspx?id=0HES51fjqEG9fSFLc8snex38PNg_2j9KiOfholseWm1UOFcwTFhBNUZYREdLQkJTRlJDNU9IQzZLMC4u';

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));
const c = cfg.campaign;

const missing = [];
for (const [t, v] of Object.entries(cfg.o11)) if (!v) missing.push('o11: ' + t);
if (!cfg.sender.email) missing.push('sender.email');
if (!c.listIds.length) missing.push('campaign.listIds');
if (SCHEDULE && !c.scheduledAt) missing.push('campaign.scheduledAt');
if (SCHEDULE && c.scheduledAt && new Date(c.scheduledAt) < new Date()) missing.push('campaign.scheduledAt is in the past');
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

let html = await readFile(new URL('./campaign-o11.html', import.meta.url), 'utf8');
const map = { ...cfg.o11 };
for (const [t, v] of Object.entries(cfg.font)) if (v) map[t] = v;
for (const [t, v] of Object.entries(map)) html = html.split(t).join(v);

const fail = m => { console.error('O11: ' + m); process.exit(1); };
const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
if (left) fail(`unresolved tokens ${[...new Set(left)].join(', ')}. Fill them, or for the font delete the @font-face block.`);
if (html.includes('background-color:#DFFD6E; color:#1A140F; font-weight:bold; padding:0 4px;')) fail('lime [placeholder] copy still in the email. Replace it with the Modul 3 text first.');
if (/\[(Rückblick|Was ihr heute|Aufgabe \d|Wie Even|Optional)/.test(html)) fail('placeholder text still in the email');
if (html.includes('data:image')) fail('inline data URI found');
if (!html.includes('{{contact.VORNAME}}')) fail('greeting tag {{contact.VORNAME}} missing');
if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) fail('use Rosaria Di Donna and Andrea Böckle');
if (html.includes('Merz')) fail('Merz reference found, this is the open cohort email');
if (!html.includes(FEEDBACK)) fail('feedback form link missing');
if (!html.includes('11. Dezember')) fail('experiment deadline 11. Dezember missing');
const imgs = (html.match(/<img /g) || []).length;
if (imgs !== EXPECT_IMGS) fail(`expected ${EXPECT_IMGS} image(s), found ${imgs}`);

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
if (!res.ok) fail(`Brevo returned ${res.status} ${text}`);
console.log(`  O11 created as draft, campaign id ${JSON.parse(text).id}`);
console.log('Done. Send a test to yourself before anyone sends.');
