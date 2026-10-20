# Handoff: Service notice "familymind is taking a short break" (DE + EN) → Brevo

## What this is

Two finished HTML emails telling **all app users** that familymind (app and web app) is offline for a few days after a server issue, and asking them **not to log out or reinstall** so locally saved data stays on their phone. They are the deliverable, not a design reference. Copy is approved by Rosa; do not rewrite or reformat any text.

- **DE subject:** familymind macht eine kurze Pause 🌿 eine kleine Bitte
- **EN subject:** familymind is taking a short break 🌿 one small favor
- **Preheaders:** "Bitte bleib eingeloggt und lass die App installiert." / "Please stay logged in and keep the app installed."
- **Signed:** Rosa und Mousa / Rosa and Mousa, familymind. Reply-to rdd@familymind.ai (the copy invites replies).
- **Send:** as soon as possible. This is time-critical: every user who logs out or reinstalls before reading it can lose local data.

Emoji in subject and heading are intentional.

## The task

1. Fill `listIds` for each language with **all app users** (paid and free). Confirm with Rosa. Suggested starting point from earlier campaigns: DE 29 (All App Users DE), EN 30 (All App Users EN). Do **not** exclude paid users this time; this is a service notice, not marketing. Leave `exclusionListIds` empty unless Rosa says otherwise.
2. Fill `sender.email`.
3. Font: since speed matters, **delete the whole `@font-face { … }` block** from both HTML files and leave the `font` values empty. Headings fall back to Georgia. Do not substitute another font.
4. Run `push-to-brevo.mjs`. It creates both campaigns as drafts and never sends.
5. Report the two campaign IDs back.

## Already resolved in the HTML

- First name: `{{contact.FIRSTNAME}}` (Rosa's draft said `{{name}}`; the script blocks `{{name}}`).
- Logo on Brevo media; no other images, no links in the body.
- Footer: socials, unsubscribe, privacy (`familymind.ai/dataprivacy/de` for DE).

**Transactional vs marketing:** this is a service message. If Rosa wants it to reach contacts who unsubscribed from newsletters, it must go through Brevo transactional email instead of a campaign; that is a separate decision, flag it rather than doing it.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
```

Node 18+, no dependencies. Validates both files before creating either: unresolved tokens, inline data URIs, the first-name tag, exactly 1 image.

## Before sending

- Test-send to Gmail, Outlook and an iPhone.
- Two grammar points in the approved copy, left as written. Ask Rosa before sending:
  - DE: "Das gilt für die App als auch unsere WebApp" → probably "sowohl für die App als auch für unsere WebApp".
  - EN: "It may take up a couple of days" → probably "up to a couple of days".
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; blue hero with the headline; greeting and two paragraphs; lime card with the favor (first sentence bold); closing paragraph; signature "Rosa und Mousa" / "familymind"; dark footer.

Do not restructure the tables; nested tables with explicit widths make this render in Outlook.

## Files

```
campaign-de.html     German email
campaign-en.html     English email
replacements.json    fill this in
push-to-brevo.mjs    creates both campaigns as drafts
media/               Cooper TTF
```
