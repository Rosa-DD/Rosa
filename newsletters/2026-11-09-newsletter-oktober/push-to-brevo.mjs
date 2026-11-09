#!/usr/bin/env node
/**
 * Creates the October newsletter ("Unser Oktober, euer November") in Brevo as two DRAFT campaigns, DE and EN.
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
const OPTIONAL = ['mut-maker-award.jpg', 'industrial-agents-hackathon.jpg'];
const MUST = {
  de: ['familymind.ai/de/blog/courage-is-a-request', 'linkedin.com/events/7521889228239097856', 'linkedin.com/events/7521890116764626944', 'youtube.com/shorts/u8-TPZHhMxA', 'app.familymind.ai', 'Februar 2027', 'familymind.ai/dataprivacy/de'],
  en: ['familymind.ai/blog/courage-is-a-request', 'linkedin.com/events/7521889228239097856', 'linkedin.com/events/7521890116764626944', 'youtube.com/shorts/u8-TPZHhMxA', 'app.familymind.ai', 'February 2027', 'familymind.ai/dataprivacy"'],
};

if (!KEY) { console.error('Missing BREVO_API_KEY.'); process.exit(1); }
const cfg = JSON.parse(await readFile(new URL('./replacements.json', import.meta.url), 'utf8'));

const missing = [];
for (const scope of ['shared', 'de', 'en']) for (const [t, v] of Object.entries(cfg[scope])) if (!v) missing.push(`${scope}: ${t}`);
if (!cfg.sender.email) missing.push('sender.email');
for (const l of LANGS) {
  if (!cfg.campaign[l].listIds.length) missing.push(`campaign.${l}.listIds`);
  if (SCHEDULE && !cfg.campaign[l].scheduledAt) missing.push(`campaign.${l}.scheduledAt`);
  if (SCHEDULE && cfg.campaign[l].scheduledAt && new Date(cfg.campaign[l].scheduledAt) < new Date()) missing.push(`campaign.${l}.scheduledAt is in the past`);
}
if (missing.length) { console.error('replacements.json is incomplete:\n  ' + missing.join('\n  ')); process.exit(1); }

function dropImageRow(html, file) {
  // removes the <tr> holding the <!-- IMAGE: file ... --> comment
  const c = html.indexOf('<!-- IMAGE: ' + file);
  if (c < 0) throw new Error('optional image row not found: ' + file);
  const start = html.lastIndexOf('<tr', c);
  const end = html.indexOf('</tr>', c) + 5;
  return html.slice(0, start) + html.slice(end);
}

async function build(l) {
  let html = await readFile(new URL(`./campaign-${l}.html`, import.meta.url), 'utf8');
  const map = { ...cfg.shared, ...cfg[l] };
  for (const [t, v] of Object.entries(map)) {
    if (v === 'DELETE') {
      const f = OPTIONAL.find(o => t.endsWith(o));
      if (!f) throw new Error(`${t} is not optional, it needs a URL`);
      html = dropImageRow(html, f);
    } else html = html.split(t).join(v);
  }
  for (const [t, v] of Object.entries(cfg.font)) if (v) html = html.split(t).join(v);
  const left = html.match(/REPLACE-WITH[A-Z0-9-]*/g);
  if (left) throw new Error(`${l}: unresolved tokens ${[...new Set(left)].join(', ')}. Fill them, or for the font delete the @font-face block.`);
  if (html.includes('data:image')) throw new Error(`${l}: inline data URI found`);
  if (!/\{\{ ?contact\.VORNAME ?\}\}/.test(html)) throw new Error(`${l}: greeting tag missing`);
  if (html.includes('Abdelmaksoud')) throw new Error(`${l}: Mousa is first name only in this newsletter`);
  if (html.includes('Rosa Di Donna') || html.includes('Boeckle')) throw new Error(`${l}: use Rosaria Di Donna and Andrea Böckle`);
  if (/Neurowissenschaftlerin|neuroscientist/.test(html)) throw new Error(`${l}: outdated Luise Hecker bio`);
  for (const s of MUST[l]) if (!html.includes(s)) throw new Error(`${l}: expected content missing: ${s}`);
  const kb = Buffer.byteLength(html, 'utf8') / 1024;
  if (kb > 100) console.warn(`  warning: ${l} is ${kb.toFixed(0)}KB, Gmail clips above ~102KB`);
  return html;
}

for (const l of LANGS) await build(l); // validate both before creating either

for (const l of LANGS) {
  const c = cfg.campaign[l];
  const body = {
    name: c.name, subject: c.subject, previewText: c.previewText,
    sender: { name: l === 'en' ? cfg.sender.nameEn : cfg.sender.name, email: cfg.sender.email },
    replyTo: cfg.sender.replyTo,
    htmlContent: await build(l),
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
console.log('Done. Send a test from each campaign before anyone sends.');
