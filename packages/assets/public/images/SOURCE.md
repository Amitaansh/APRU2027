# Generated imagery

Everything in this folder is produced by `npm run imagery`. Do not hand-edit.

- Source: D:/APRU/landing-elements/DOA-APRU-MainImage.jpg
- Hero: the source as supplied — resized to 16:9 from the centre, CMYK transformed to sRGB, no treatment beyond the 4 overprint patches clone-stamped out (HERO_HEAL in the script).
- Home key art: D:/APRU/wetransfer_doa-apru-files-3-september_2026-09-03_0357/SVG/SVG/SVG/Asset 1.svg
- Home: the artwork alone. The title, series line, dates and both lockups are live text and SVG in the page, not pixels — see packages/ui/src/KeyVisual.tsx.
- Home crop: (77.25, 943.05) 11600x6525 of the plate, read off the master's own image transform — object-position 36.6% 69.9%, baked in.
- Home widths: 768, 1280, 1920, 2560 landscape, 480, 768, 1080, 1440 portrait (2:3, its own cut of the plate). AVIF q60 — the measured grain knee — with WebP q70 to 1920 as the no-AVIF fallback.
- OG card: greyscale, contrast lift, ordered 8x8 Bayer dither, two-colour map (#f89c2c over #143a5c) — Design Brief §05.
- Widths: 768, 1280, 1920 (AVIF + WebP), OG card 1200x630 PNG.
- Portraits (committee and keynotes): D:/APRU/committee-source — 4:5 crop from the top, or the window in PORTRAIT_CROPS, greyscale, 440x550 (AVIF + WebP) in ./committee.

Re-run after final art is supplied.
