# APRU-SCL 2027 — Bridging Resilience(s)

The official site for the 10th Conference of APRU Sustainable Cities and
Landscapes, hosted by the NUS Department of Architecture, 21–23 May 2027,
Singapore.

A static, no-backend informational site: no database, no accounts, no forms that
post anywhere. Every action a visitor can take is an outbound link.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to out/
npm test             # phase engine + WCAG contrast guards
npm run imagery      # regenerate duotone hero, OG card, icons
```

`npm run build` writes a fully static `out/` — it can be served by anything.

## Stack

Next.js 16 (App Router, `output: "export"`) · TypeScript · Tailwind v4 ·
next-themes · Motion · Plausible (optional) · deployed on Vercel.

## How it is organised

```
app/            one folder per route, all statically exported
components/     ui/ primitives, layout/ shell, plus per-page pieces
content/        the entire data layer — typed JSON, plus phases.ts
lib/            phase engine, content loaders, SEO, analytics
scripts/        imagery pipeline (duotone dither, OG card, icons)
```

There is no database. `content/*.json` is the data layer, typed by
`lib/types.ts` and validated at build time by `lib/content.ts` — a malformed
content edit fails `npm run build` rather than shipping a blank region.

## The phase engine

The site is date-aware. `content/phases.ts` holds the milestone dates and the
call-to-action for each phase; `lib/phase.ts` resolves which phase today falls
in. That single answer drives the hero CTA, the floating CTA, the footer CTA,
and which pages appear in the navbar.

| Phase | Active when | CTA |
|---|---|---|
| P0 | now → registration opens | Register your interest |
| P1 | registration opens | Register now |
| P2 | abstract window open | Submit an abstract |
| P3 | final weeks | Register now + countdown |
| P4 | after 23 May 2027 | View proceedings, or none |

Every future milestone is `null` today, so the site sits in **P0** and behaves as
a straightforward "register your interest" launch. **Filling one date in
`content/phases.ts` switches that phase on** — the resolution happens in the
visitor's browser, so a date passing changes the live site without a redeploy.

Because pages are statically exported, the HTML ships with the phase as of the
build date and reconciles to the visitor's own date on hydration. That keeps
crawlers and no-JS visitors on a correct state rather than a blanket P0.

## Changing content after launch

Almost everything is a data edit, not a code change:

| To do this | Edit this |
|---|---|
| Add a confirmed speaker | `content/speakers.json` — the page fills and promotes into the navbar automatically |
| Publish the schedule | `content/program.json` — Programme is already in the navbar via `active: true` in `content/nav.json` |
| Open registration | `registrationOpens` in `content/phases.ts` + `NEXT_PUBLIC_REGISTRATION_URL` |
| Open abstracts | `abstractsOpen` / `abstractsClose` + `NEXT_PUBLIC_UVENTS_URL` |
| Publish a deadline | `content/phases.ts` — the dates table on Programme, Register and Call for Abstracts derives from it |
| Fill in a venue detail | `content/venue.json`, flip `status` to `confirmed` |
| Add a FAQ | `content/faq.json` |

`content/phases.ts` is the single source for every machine-relevant date.
`content/dates.json` only holds rows the engine does not know about.

## Configuration

See `.env.example`. Three values block go-live: `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_INTEREST_FORM_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`. Anything unset
renders a labelled "link coming soon" affordance — never a dead link.

## Design system

Tokens live in `app/globals.css` and are ported from the Design Brief v2:
monochrome ink-on-paper with orange used as a splash, Archivo (with its variable
`wdth` axis standing in for Archivo Expanded) plus Space Mono for labels, a
12-column grid with visible hairlines, and scroll-driven motion.

Brand orange `#f89c2c` is a **fill colour, not a text colour** — it is 1.9:1 on
paper. `--accent` is the darkened equivalent used for text in light theme.
`npm test` enforces both themes against WCAG AA and will fail if the palette
drifts.

## Before go-live

`CONTENT-REVIEW.md` lists every drafted copy block for committee sign-off, and
what was deliberately left unpublished.
