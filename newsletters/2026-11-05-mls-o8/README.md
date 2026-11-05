# Handoff: The Mental Load Shift, O8 (open cohort) → Brevo

## What this is

One finished German HTML email for the **open cohort**, sent after Check-In 2. It is the deliverable, not a design reference. Copy is approved; do not rewrite or reformat any text.

- **Subject:** Danke für heute! Eure Aufgaben bis zum 13.11.
- **Preheader:** Aufgabenpakete, Mindeststandards und eine Woche mit echten Zahlen.
- **From:** Andrea & Rosaria. Reply-to rdd@familymind.ai.
- **Greeting:** `{{contact.VORNAME}}`.
- **Recipients:** list **33 (Open Cohort)**, prefilled. Confirm with Maha. Never the Merz pilot list (M8 is their version, with 18.11.).
- **Send:** O8 was planned for right after Check-In 2 (Fri 30.10.). If it has not gone out yet, check with Rosaria whether to send it now: O9 (week tracker reminder) builds on it, and the deadline in the copy is Check-In 3 on **13.11.**

**Names:** always **Rosaria Di Donna** and **Andrea Böckle**.

## Content

Recap of Check-In 2; "Eure Aufgaben bis zum 13. November" as four numbered steps; lime card "So unterstützt dich familymind"; feedback card with "Kurzes Feedback geben" → the shared Microsoft Forms link (same as O5/M5/M8); sign-off Andrea & Rosa; dark footer. Logo only, no other images.

## The task

1. Confirm list 33, fill `sender.email`.
2. **Delete the whole `@font-face { … }` block** from `campaign-o8.html`, leave `font` values empty. Headings fall back to Georgia.
3. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates an unscheduled draft, never sends. To schedule, set `scheduledAt` and add `--schedule`.
4. Report the campaign ID.

Node 18+, no dependencies. Validates: unresolved tokens, data URIs, greeting tag, name spellings, feedback link, no Merz reference, 13.11. date (and no 18.11.), image count. `--schedule` refuses a past date.

## Before sending

- Test-send to yourself; tap the feedback button.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

Do not restructure the tables.

## Files

```
campaign-o8.html     the email
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
