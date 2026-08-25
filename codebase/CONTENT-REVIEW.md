# Content review checklist

Everything on the site is one of three things. This document exists so the
organising committee can sign off the third category before go-live.

| Class | Meaning | Action needed |
|---|---|---|
| **Client copy** | Taken verbatim (or near-verbatim) from documents you supplied | Confirm it is the final wording |
| **Drafted** | Written for this build from your source material | **Read and approve or amend** |
| **TBA state** | Deliberately unconfirmed, rendered as a designed "to be announced" block | Nothing — replaced when the facts land |

No fact, name, date, fee, or deadline anywhere on the site was invented. Where
something is not confirmed, the page says so.

---

## Client copy — confirm wording is final

| Where | Source |
|---|---|
| `/about` — the four theme paragraphs | `APRU-SCL27_Theme_draft.pdf`, used essentially verbatim |
| Home — opening paragraph (`site.intro`) | Same, first paragraph |
| `/program` — working group introduction | `2027 Working Group Proposals_Updated 8.20.26.pdf`, introduction section |
| `/program` — all 11 working group titles, convenors, and descriptions | Same PDF. Convenor **email addresses were deliberately not published** |
| `/about` — organising committee roster (11 names, NUS Department of Architecture) | `Website sitemap.pdf`. **Individual emails deliberately not published** — see open item 3 |
| Prior editions (8th SFU Vancouver 2025, 9th Shanghai Jiao Tong 2026) | PRD §5.1 |

## Drafted — needs committee approval

| Where | What was written | Why |
|---|---|---|
| `/program` — intro paragraph | Describes the three-day format, symposium and field visits | No program copy existed |
| `/program` — five format block summaries | "What to expect" for keynotes, thematic sessions, working groups, student symposium, field visits | Derived from the APRU-SCL format and the client sitemap |
| `/venue` — Singapore section | Density, land scarcity, water self-sufficiency framing | Extends the theme document's own framing of Singapore |
| `/venue` — NUS section, getting here, visas | Kent Ridge location, Changi connections, ICA visa pointer | Standard attendee guidance. **Check the visa wording and the invitation-letter promise** |
| `/register` — what registration will include | Three blocks: conference access, student rate, field visits | No fees or figures are stated anywhere |
| `/call-for-abstracts` — submission formats | Papers, posters, panels | The three formats named in the theme document |
| `/contact` — all 8 FAQ answers | Dates, audience, APRU-SCL, abstracts, students, working groups, registration, staying informed | Only questions answerable today are included |
| Home — three section teasers | Short lead-ins to About, Program, Call for Abstracts | Navigation copy |
| All TBA block wording | Phrased as intentionally early rather than unfinished | PRD §6 |

### Points to check specifically

1. **`/venue` visa section** promises "the organising committee can provide a
   letter of invitation to registered participants." Confirm you will offer this.
2. **`/venue` accommodation and exact venue** are TBA blocks — no hotels named.
3. **`/program` schedule** shows no timetable, only the note that detail follows.
4. **`/contact` FAQ on abstracts** says submission will be through "the
   conference submission platform" rather than naming UVENTs, since the URL is
   not live yet. Say the word and it will name UVENTs explicitly.
5. **Working group convenors** are listed with name and institution only.
   Confirm this is acceptable to them, or whether they want to be contactable.

## Not published on purpose

- No registration fees or figures of any kind.
- No deadline dates — every date row reads TBA except the conference itself.
- No speaker names.
- No individual email addresses (committee or working group convenors).
- No scientific committee (rendered as a TBA block).
- No sponsor or partner logos (pending from your team per the sitemap).

## Brand assets

The APRU and NUS marks are **typographic wordmark lockups**, not reconstructions
of the official logos — deliberately, because recreating an institution's logo
on its own conference site is a brand-compliance risk. Supply the official files
and they drop into `components/brand/Logos.tsx`.

The hero and Open Graph imagery is generated from `DOA-APRU-MainImage.jpg` with
the Design Brief §05 duotone dither treatment. The Open Graph card's type
currently renders in a system grotesque rather than Archivo, because Archivo is
not installed on the machine that generated it — re-run `npm run imagery` on a
machine with Archivo installed, or supply final art, for an exact match.
