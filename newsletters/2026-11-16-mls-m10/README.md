# Handoff: The Mental Load Shift, M10 (Merz pilot, before Check-In 3) → Brevo

## What this is

One finished German HTML email for the **Merz pilot**, sent before Check-In 3. It is the deliverable, not a design reference. Copy mirrors the open cohort's O10 with Merz dates; do not rewrite it.

- **Subject:** Am Mittwoch ist Check-In 3: Was hat eure Woche gezeigt?
- **Preheader:** Diesmal geht es um Muster, Rituale und sichere Experimente.
- **From:** Rosaria & Andrea. Reply-to rdd@familymind.ai.
- **Greeting:** `{{contact.VORNAME}}`.
- **Recipients:** list **34 (Merz Cohort)**, prefilled from Notion. Never list 33 (open cohort).
- **Check-In 3:** Wed 18.11.2026, 12:30 to 14:00, online via Teams.
- **Send:** **today, Mon 16.11.** The intro says "übermorgen"; if it goes out on Tue 17.11., ask Rosaria to change it to "morgen". Create an unscheduled draft and send manually after approval.

**Names:** always **Rosaria Di Donna** and **Andrea Böckle**.

## The task

1. **Merz logo:** reuse the Brevo media URL from M6/M7/M9. Paste into `replacements.json → m10`.
2. **Teams link** for Check-In 3: ask Rosaria (it is in her Teams invitation). Used by the inline "Teams-Link" and the orange "Hier geht's zum Call" button.
3. Fill `sender.email`; confirm list 34 with Maha.
4. **Delete the whole `@font-face { … }` block** from `campaign-m10.html`, leave `font` values empty. Headings fall back to Georgia.
5. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates a draft, never sends.
6. Report the campaign ID.

Node 18+, no dependencies. Validates: unresolved tokens, data URIs, greeting tag, name spellings, Merz date/time, logo and footer, and blocks open cohort leftovers (Freitag, 13. November, Zoom). Expects 2 images (familymind + Merz logos).

## Before sending

- Test-send to yourself; check both logos sit on one line on mobile; tap the Teams link and the button.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.

## Structure

Co-branded header (familymind | Merz); hero with "The Mental Load Shift" label and subject; greeting and intro; lime card "Deine Vorbereitung (fünf Minuten)"; "Alles Wichtige für Mittwoch" with Wann/Wo; orange call button; "Bis Mittwoch!"; signature Rosa & Andrea with full names; Merz footer. Do not restructure the tables.

## Files

```
campaign-m10.html    the email
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
