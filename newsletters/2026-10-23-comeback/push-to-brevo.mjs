#!/usr/bin/env node
/**
 * Creates the comeback email ("familymind ist zurück" / "familymind is back") in Brevo as two DRAFT campaigns.
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
const LANGS = ['de', 'en'];
const EXPECT_IMGS = 4; // logo + 3 step screenshots
const MUST = {
  de: ['Liebe {{contact.VORNAME}},', 'Version 1.1.0', 'teams.microsoft.com/meet/3934577337414769', 'Rosa und Mousa', 'familymind.ai/dataprivacy/de'],
  en: ['Dear {{contact.VORNAME}},', 'version 1.1.0', 'teams.microsoft.com/meet/3425654951722817', 'Rosa and Mousa', 'familymind.ai/dataprivacy"'],
};

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));

const missing = [];
for (const [t, v] of Object.entries(cfg.shared)) if (!v) missing.push('shared: ' + t);
if (!cfg.sender.email) missing.push('sender.email');
for (const l of LANGS) {
  if (!cfg.campaign[l].listIds.length) missing.push(`campaign.${l}.listIds`);
  if (SCHEDULE && !cfg.campaign[l].scheduledAt) missing.push(`campaign.${l}.scheduledAt`);
}
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

async function build(l) {
  let html = await readFile(new URL(`./campaign-${l}.html`, import.meta.url), 'utf8');
  for (const [t, v] of Object.entries(cfg.shared)) html = html.split(t).join(v);
  for (const [t, v] of Object.entries(cfg.font)) if (v) html = html.split(t).join(v);
  const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
  if (left) throw new Error(`${l}: unresolved tokens ${[...new Set(left)].join(', ')}. Fill them, or for the font delete the @font-face block.`);
  if (html.includes('data:image')) throw new Error(`${l}: inline data URI found`);
  if (html.includes('{{ contact.')) throw new Error(`${l}: use {{contact.VORNAME}} without spaces`);
  for (const s of MUST[l]) if (!html.includes(s)) throw new Error(`${l}: expected content missing: ${s}`);
  const imgs = (html.match(/<img /g) || []).length;
  if (imgs !== EXPECT_IMGS) throw new Error(`${l}: expected ${EXPECT_IMGS} images, found ${imgs}`);
  return html;
}

for (const l of LANGS) await build(l); // validate both before creating either

for (const l of LANGS) {
  const c = cfg.campaign[l];
  const body = {
    name: c.name, subject: c.subject, previewText: c.previewText,
    sender: { name: c.senderName, email: cfg.sender.email },
    replyTo: cfg.sender.replyTo,
    htmlContent: await build(l),
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
  if (!res.ok) throw new Error(`${l}: Brevo returned ${res.status} ${text}`);
  console.log(`  ${l.toUpperCase()} created as draft, campaign id ${JSON.parse(text).id}`);
}
console.log('Done. Send a test from each campaign before anyone sends.');
