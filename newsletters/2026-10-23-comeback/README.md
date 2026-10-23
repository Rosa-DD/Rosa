# Handoff: Comeback email "familymind ist zurück" / "familymind is back" (DE + EN) → Brevo

## What this is

Two finished HTML emails from Rosa and Mousa announcing that familymind is back after the outage, with a three-step restore guide (update to 1.1.0, confirm with email code, done), thanks, an office hour, and a request for store ratings. They are the deliverable, not a design reference. **Copy is approved; do not change any text.** Emoji (💛 🙏 🌿) are intentional.

- **Subjects:** familymind ist zurück / familymind is back
- **Preheaders:** "Keine 24 Stunden später sind wir zurück. In drei Schritten ist alles wieder da." / "Less than 24 hours later, we're back. Three steps and everything is there again."
- **Greeting:** `Liebe {{contact.VORNAME}},` / `Dear {{contact.VORNAME}},` (no spaces inside the braces). Confirm VORNAME is filled, otherwise it renders "Liebe ,".
- **Signed:** Rosa und Mousa / Rosa and Mousa. Reply-to rdd@familymind.ai.
- **Send:** as soon as approved. Goes to **all app users, free and paid** (the copy addresses both: "ganz egal, ob du familymind mit Premium oder kostenlos nutzt").

## The task

1. Fill the two **review links** in `replacements.json → shared` (App Store "write a review" URL and Google Play listing). Both languages use the same links.
2. Fill `listIds`: suggested DE 29 (All App Users DE), EN 30 (All App Users EN). Confirm with Maha, and check list 14 (Paid Users) is covered since it is not language-split.
3. Fill `sender.email`.
4. **Delete the whole `@font-face { … }` block** from both HTML files, leave `font` values empty. Headings fall back to Georgia.
5. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates drafts, never sends.
6. Report both campaign IDs.

## Already resolved in the HTML

- Step screenshots on Brevo media (`6adb33cca75bdcf652033ee9`, `…eea`, `6adb33cc44940b58d99c4c64`). The same German screenshots are used in the EN version, as in the source; flag to Rosa if English screenshots exist.
- DE office hour Tue 27.10., 9:00 to 9:30: `https://teams.microsoft.com/meet/3934577337414769?p=nHHpnqYfHovIL6W8Er`
- EN office hour Tue 27 Oct, 10:00 to 10:30 German time: `https://teams.microsoft.com/meet/3425654951722817?p=QiBvwuKDS0euuuzjlH`
- Footer: socials, unsubscribe, privacy (`/dataprivacy/de` for DE).

## Run

Node 18+, no dependencies. Validates both before creating either: unresolved tokens, inline data URIs, greeting tag format, key content (version, Teams link, signature, privacy link), exactly 4 images.

## Before sending

- Test-send to Gmail, Outlook and an iPhone. Check the three step columns stack on mobile.
- Tap both Teams links and both review buttons.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- The copy says "Hab ein schönes Wochenende" / "Have a lovely weekend"; if the send slips past Friday, ask Rosa.

## Structure

600px table on beige `#EDE1D5`, white panel. Logo; lime hero "Ein Update von Rosa und Mousa" + headline; greeting and intro; lavender (`#EEEDFD`) card "In drei Schritten zurück" with three screenshot columns (purple `#6E6BF2` step labels) and a code note; thanks paragraph; white office hour card with lavender outline and purple Teams button; rating paragraph with two outlined store buttons; closing; signature; dark footer.

Do not restructure the tables.

## Files

```
campaign-de.html / campaign-en.html
replacements.json    fill this in
push-to-brevo.mjs    creates both campaigns as drafts
media/               Cooper TTF
```
