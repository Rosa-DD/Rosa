# Handoff: The Mental Load Shift, M8 (Merz pilot) → Brevo

## What this is

One finished German HTML email for the **Merz pilot** participants, sent after Check-In 2 (Wed 4.11.2026). It is the deliverable, not a design reference. Copy is approved; do not rewrite or reformat any text.

M8 is the Merz version of O8 (open cohort). Only two things differ: the task deadline is **18.11.** (Merz Check-In 3) instead of 13.11., and the footer says "über Merz Lifecare".

- **Subject:** Danke für heute! Eure Aufgaben bis zum 18.11.
- **Preheader:** Aufgabenpakete, Mindeststandards und eine Woche mit echten Zahlen.
- **From:** Andrea & Rosaria. Reply-to rdd@familymind.ai.
- **Greeting:** `{{contact.VORNAME}}`.
- **Planned send:** Wed 4.11.2026 (today), after Check-In 2 ends at 14:00. Prefilled 16:00 CET.
- **Recipients:** Merz pilot list only.

**Names:** always **Rosaria Di Donna** and **Andrea Böckle**.

## Content

Recap of Check-In 2; "Eure Aufgaben bis zum 18. November" as four numbered steps; lime card "So unterstützt dich familymind" (Mindeststandards in Even, Wochen-Tracker, one swap at a time); feedback card with "Kurzes Feedback geben" → the shared Microsoft Forms link (same as O5/M5/O8); sign-off Andrea & Rosa; dark footer. Logo only, no other images.

## The task

1. Fill `campaign.listIds` with the Merz pilot list.
2. Fill `sender.email`.
3. **Delete the whole `@font-face { … }` block** from `campaign-m8.html`, leave `font` values empty. Headings fall back to Georgia.
4. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs` (add `--schedule` to apply 16:00). Creates a draft, never sends.
5. Report the campaign ID.

Node 18+, no dependencies. Validates: unresolved tokens, data URIs, greeting tag, name spellings, feedback link, Merz footer, 18.11. date (and no leftover 13.11.), 1 image. `--schedule` refuses a past date.

## Before sending

- Test-send to yourself; tap the feedback button.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- Confirm with Rosaria that the Merz Check-In 3 is still on 18.11.

Do not restructure the tables.

## Files

```
campaign-m8.html     the email
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
