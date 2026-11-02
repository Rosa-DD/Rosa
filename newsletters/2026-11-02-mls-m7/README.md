# Handoff: The Mental Load Shift, M7 (Merz pilot) → Brevo

## What this is

One finished German HTML email for the **Merz pilot** participants, sent before Check-In 2. It is the deliverable, not a design reference. Copy is approved; do not rewrite or reformat any text.

- **Subject:** Am Mittwoch ist Check-In 2: bitte vorher das Quiz machen
- **Preheader:** Diesmal geht es um die (Fair-)Teilung von Mental Load und Care-Arbeit.
- **From:** Rosa & Andrea. Reply-to rdd@familymind.ai.
- **Greeting:** `{{contact.VORNAME}}` (no spaces).
- **Planned send:** Mon 2.11.2026 (today, "übermorgen" refers to Wed 4.11.). Prefilled 9:00 CET; if that has passed, create an unscheduled draft and send manually once approved.
- **Recipients:** Merz pilot list only.

**Names:** always **Rosaria Di Donna** and **Andrea Böckle**.

## Content

Greeting and intro; "Bitte leg dir bereit" (quiz link `familymind.ai/mental-load-score/de`); **lime card for participants who have not created their account yet**, with the code **MENTALLOADSHIFT** in bold and a dark button "familymind jetzt einrichten →" to `https://app.familymind.ai/`; "Alles Wichtige für Mittwoch" (Wed 4.11., 12:30 to 14:00, Teams link in Rosa's invitation); sign-off Rosa & Andrea; dark footer ("über Merz Lifecare").

The lime card text was written by design, not from the original cascade. Confirm with Rosaria before sending.

## The task

1. Fill `campaign.listIds` with the Merz pilot list.
2. Fill `sender.email`.
3. **Delete the whole `@font-face { … }` block** from `campaign-m7.html`, leave `font` values empty. Headings fall back to Georgia.
4. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates a draft, never sends.
5. Report the campaign ID.

Node 18+, no dependencies. Validates: unresolved tokens, data URIs, greeting tag, name spellings, quiz link, code, web app button, date, image count. `--schedule` refuses a past date.

## Before sending

- Test-send to yourself; tap the quiz link and the setup button.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

Do not restructure the tables.

## Files

```
campaign-m7.html     the email
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
