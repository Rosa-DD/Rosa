# Handoff: October newsletter "Unser Oktober, euer November" (DE + EN) → Brevo

## What this is

Two finished HTML newsletters from Rosa looking back on October and ahead to November. They are the deliverable, not a design reference. **Copy is approved; do not change any text.** Emoji (🍂 🏆 🤖 🌱) are intentional.

- **Subjects:** Unser Oktober, euer November 🍂 / Our October, your November 🍂
- **Preheaders:** "Ein Award Abend, ein Hackathon Sieg, zwei Kohorten und was als Nächstes kommt" / "An award night, a hackathon win, two cohorts and what comes next"
- **Greeting:** `{{contact.VORNAME}}`. Confirm the attribute is filled, otherwise it renders "Hallo ,".
- **From:** Rosa von familymind / Rosa from familymind. Reply-to rdd@familymind.ai (the next-cohort box asks readers to reply).
- **Send:** before **Wed 11 November**, the first Shared by Design episode (Rike Engel). Ideally Mon 9 or Tue 10 November.

## Content, top to bottom

Logo; hero; personal intro; three October highlights (Mut Maker Award, Mousa's hackathon win, two Mental Load Shift cohorts), each with an optional photo; familymind in the browser with web app banner and button; Shared by Design E5 (Rike Engel, 11.11.) and E6 (Dr. Luise Hecker, 25.11.) with speaker photos and LinkedIn event links; what we hear from The Mental Load Shift; "Zum Anschauen und Weiterlesen" with the MMA speech video and the Mut Maker blog article; lime next-cohort box (February 2027, partners included, DE and EN sessions) with reply button; closing; Rosa's signature; footer.

## Images

| Token file | Lang | Where | Upload size | Displays at | Required |
| --- | --- | --- | --- | --- | --- |
| `mut-maker-award.jpg` | both | Mut Maker highlight | 1008×568 | 504×284 | optional |
| `industrial-agents-hackathon.jpg` | both | hackathon highlight | 1008×568 | 504×284 | optional |
| `webapp-skills-de.png` | DE | browser section | in `media/` | 444×250 | yes |
| `webapp-skills.png` | EN | browser section | in `media/` | 444×250 | yes |
| `rike-engel.jpg` | both | E5 speaker | 152×152 | 76×76 | yes |
| `luise-hecker.jpg` | both | E6 speaker | 152×152 | 76×76 | yes |
| `mma-speech-thumbnail.jpg` | both | video card | 228×228 | 114×114 | yes |
| `blog-mut-meets-technologie.jpg` | both | blog card | 228×228 | 114×114 | yes |

The two web app banners may already be in Brevo media from the web app newsletter; reuse those URLs. For the two **optional** event photos, set the value to `"DELETE"` in `replacements.json` if there is no photo; the script removes that image row cleanly. Ask Rosa for the speaker photos, the speech thumbnail (a still from the YouTube short works) and the blog header image.

## Already resolved in the HTML

- Web app button → `https://app.familymind.ai/` with `utm_campaign=oktober-rueckblick`.
- E5 Rike Engel → `https://www.linkedin.com/events/7521889228239097856?viewAsMember=true`
- E6 Dr. Luise Hecker → `https://www.linkedin.com/events/7521890116764626944?viewAsMember=true` (bio updated: molecular biologist (PhD) and family food coach, "What's for dinner?")
- MMA speech → `https://youtube.com/shorts/u8-TPZHhMxA?feature=share`
- Blog → `familymind.ai/de/blog/courage-is-a-request` (DE) / `familymind.ai/blog/courage-is-a-request` (EN), with UTM.
- Next cohort button → `mailto:rdd@familymind.ai` with subject "Mental Load Shift Februar 2027" / "… February 2027".
- Mousa appears by first name only (the script blocks "Abdelmaksoud").

## Lists

Prefilled from earlier newsletters, **confirm with Maha**: DE 29 (All App Users DE) + 7 (ContactList_DE); EN 30 (All App Users EN) + 8 (Contact_EN) + 15 (Newsletter). No exclusions: this goes to paid and free users alike. If Rosa wants it to reach Mental Load Shift participants too (lists 33 and the Merz pilot list), add them; Brevo de-duplicates contacts across lists.

## The task

1. Upload the images, fill URLs (or `"DELETE"` for the two optional ones).
2. Confirm lists, fill `sender.email`.
3. **Delete the whole `@font-face { … }` block** from both HTML files, leave `font` values empty. Headings fall back to Georgia.
4. Run `BREVO_API_KEY=xkeysib-... node push-to-brevo.mjs`. Creates drafts, never sends.
5. Report both campaign IDs.

Node 18+, no dependencies. Validates both before creating either: unresolved tokens, data URIs, greeting tag, Mousa first name only, name spellings, outdated Luise bio, every key link, Gmail clip size.

## Before sending

- Test-send to Gmail, Outlook and an iPhone. Click every link: web app, both LinkedIn events, YouTube, blog, reply button.
- Confirm `{{ unsubscribe }}` matches this account's tag syntax.
- Flag to Rosa: the German next-cohort box also asks readers which language they prefer; the brief only asked about interest in an English cohort.

Do not restructure the tables.

## Files

```
campaign-de.html / campaign-en.html
replacements.json    fill this in
push-to-brevo.mjs    creates both campaigns as drafts
media/               2 web app banners + Cooper TTF
```
