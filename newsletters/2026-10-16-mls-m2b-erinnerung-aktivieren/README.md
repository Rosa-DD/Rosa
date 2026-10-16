# Handoff: The Mental Load Shift, M2b "Erinnerung: familymind aktivieren" → Brevo

## What this is

One finished German HTML email for the **Merz pilot** of The Mental Load Shift: a reminder to activate familymind before Check-In 1. It is the deliverable, not a design reference. Copy is approved; do not rewrite or reformat any text.

- **Subject:** Am Mittwoch geht's los: Ist familymind schon startklar?
- **Preheader:** Drei Schritte zur Aktivierung und was dich in den vier Check-Ins erwartet.
- **From:** Rosaria (signs as "Rosa"), reply-to rdd@familymind.ai
- **Send:** today, **Fri 16.10.2026**. Check-In 1 is Wed 21.10., 12:30 to 14:00, on Teams.

**Names:** always **Rosaria Di Donna** (never "Rosa Di Donna") and **Andrea Böckle** (never "Boeckle"). The script refuses to push if either misspelling appears.

## The task

1. Decide on the font (below).
2. Fill `listIds` with the **Merz pilot** participants list and `sender.email`. Do not use the open cohort list: their dates are different and they start today.
3. Run `push-to-brevo.mjs`. It creates one draft and never sends.
4. Report the campaign ID back.

## Already resolved in the HTML

- App Store `https://apps.apple.com/de/app/familymind/id6740882851`, Google Play `https://play.google.com/store/apps/details?id=ai.familymind`, web app `https://app.familymind.ai`
- Store badges hosted on Brevo. Apple 120×40; Google Play 150×58, because Google's official PNG has transparent padding built in, so at that size its visible badge matches Apple's height. Do not "fix" them to equal pixel sizes.
- Logo and Rosaria's photo hosted on Brevo.
- Step 3 names the code MENTALLOADSHIFT inline; there is deliberately no separate code box.
- The four Check-In dates (21.10., 04.11., 18.11., 03.03.2027) in a teal card.
- Footer says the reader takes part via Merz Lifecare; privacy link `familymind.ai/dataprivacy/de`.
- There is **no Teams link** in the email by design: the copy points to Rosaria's Teams invitation.

## Font

Cooper BT Light loads via `@font-face`, the only token. Brevo does not host fonts. Since this sends today, the fast path is to **delete the whole `@font-face { … }` block** and leave the `font` values empty; headings then fall back to Georgia. Do not substitute another font.

## Run

```
BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs
```

Node 18+, no dependencies. Checks for unresolved tokens, inline data URIs, name spellings, the code, the 21. Oktober date, and exactly 4 images.

## Before sending

- Test-send to Gmail, Outlook and an iPhone. Check the two badges sit on one line on mobile and look the same height.
- Confirm `{{contact.FIRSTNAME}}` resolves and `{{ unsubscribe }}` matches this account's tag syntax.
- Confirm the list is the Merz pilot.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; pink hero with "The Mental Load Shift" label, subject as headline and preheader line; greeting and Teams intro; "So aktivierst du familymind" as three numbered steps (badges and web app link, "Code einlösen", code); "Du hast das schon erledigt?" line; teal card with the four Check-Ins; help paragraph and "Bis Mittwoch!"; Rosaria's signature with photo; dark footer.

Do not restructure the tables; nested tables with explicit widths make this render in Outlook.

## Files

```
campaign-m2b.html    the email
replacements.json    fill this in
push-to-brevo.mjs    creates the campaign as a draft
media/               Cooper TTF
```
