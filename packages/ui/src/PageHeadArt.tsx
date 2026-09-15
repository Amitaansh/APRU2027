import type { ReactNode } from "react";
import { MaskLines, Reveal } from "./Reveal";

/**
 * How every page other than the home page opens in the client edition: the key
 * artwork full bleed, the title set white across the foot of it.
 *
 * WHY THIS EXISTS BESIDE PageHead. The home page is now the designer's poster,
 * edge to edge, with its type drawn into the file. A black-on-white title block
 * on every page behind it reads as a different site. This is the same opening
 * gesture as the poster, made from the parts we do control: the artwork the
 * poster is built on, and a real heading over it.
 *
 * PageHead itself is untouched and still in use — the portfolio edition opens
 * on white and should keep doing so.
 *
 * THE ONE COLOUR IN @apru/ui. Everything else in this package draws rules in
 * `currentColor` and lets the edition decide the ink, which is what lets one
 * component render rich in one app and calm in the other. This component sets
 * white explicitly, because the ground it is setting type on is not the page's
 * ground: it is an image this component puts there itself. Nothing outside can
 * know what that ground is, so nothing outside can choose the ink for it.
 *
 * THE SCRIM IS GONE, AND THAT COSTS SOMETHING. It was a gradient under the type:
 * "remove the 'dark' effect at the bottom of the main image and adjust the
 * spacing", and this is that removal, made as asked.
 *
 * What it was doing is worth writing down, because nothing else is doing it now.
 * The artwork is saffron and cerulean at roughly equal luminance, and white on
 * the saffron measures about 2:1 — nowhere near the 4.5:1 the rest of the site
 * holds itself to. The gradient was what bought that contrast, which is also why
 * the type sits at the bottom, where it was densest. With it out, the title's
 * legibility is whatever the artwork happens to be behind it at that width, and
 * on a saffron passage it fails WCAG AA.
 *
 * Nothing in the test suite catches this: contrast.test.ts guards the token
 * palette, and type over a photograph has no token. Raised with the client in
 * writing rather than quietly absorbed here.
 *
 * NO CLOSING RULE. PageHead draws a hairline under its title to close the
 * opening. Here the artwork's own bottom edge does that, and a black rule
 * directly beneath a photograph reads as a seam rather than as a gesture.
 *
 * TWO HEIGHTS. "full" runs the band to the foot of the viewport, which is how
 * every interior page has opened since the poster went in. "short" is a sample
 * the client asked to see on one page -- "try using 1/3 of the main image for
 * page title background, apply to 1 page and share with us for review" -- so it
 * is a prop that page passes, not a change to the default.
 *
 * It began as a literal third of the viewport-less-header height, anchored to
 * the artwork's top edge. On review the client pointed at the Keynotes band on
 * their own screen as the size and crop they wanted, and what they were looking
 * at was a strip about a fifth as tall as it is wide showing the middle of the
 * artwork. So that is what this is: 400rem, which is 21% of the width at the
 * design basis and scales with everything else on the site, rather than a
 * fraction of the window height that changed the crop with every resize. The
 * artwork sits at its centre, as it does in the full band, so About and
 * Keynotes show the same slice at different heights. 240rem on phones, where
 * the label and a one-line title need about 130 of it.
 *
 * If the client picks it, the default flips here and the prop comes off About.
 */
export function PageHeadArt({
  label,
  title,
  lede,
  band = "full",
}: {
  label: string;
  title: string[];
  lede?: ReactNode;
  band?: "full" | "short";
}) {
  const height =
    band === "short" ? "h-[400rem] max-md:h-[240rem]" : "h-[calc(100svh-var(--hdr))]";

  return (
    <>
      {/* Padded rather than offset, so the band starts where the fixed header
          ends instead of running behind it.

          `.pg-art` is a hook, not a style: the client's stylesheet uses it to
          close the gap between this band and the first paragraph under it. See
          the rule beside it in apps/client/app/globals.css. */}
      <section className="pg-art pt-[var(--hdr)]">
        <div className={"relative flex w-full items-end overflow-hidden " + height}>
          <picture>
            <source
              srcSet="/images/hero-1920.avif 1920w, /images/hero-1280.avif 1280w, /images/hero-768.avif 768w"
              type="image/avif"
              sizes="100vw"
            />
            <img
              src="/images/hero-1280.webp"
              srcSet="/images/hero-1920.webp 1920w, /images/hero-1280.webp 1280w, /images/hero-768.webp 768w"
              sizes="100vw"
              alt=""
              width={1920}
              height={1080}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>

          <div className="ctr relative w-full pb-[44rem] text-wh max-md:pb-[28rem]">
            <Reveal className="rise pb-[18rem] max-md:pb-[12rem]">
              <p className="t-lbl">{label}</p>
            </Reveal>
            {/* Gated on the fonts, not the scroll — it is already on screen. */}
            <MaskLines as="h1" immediate className="t-h1" lines={title} />
          </div>
        </div>
      </section>

      {/*
       * The lede returns to the page's own ground. No client page passes one
       * today — the client had the subtext taken off every page — but the prop
       * is the one thing PageHead offers that the band cannot hold, so it stays
       * available rather than being quietly dropped from the contract.
       */}
      {lede && (
        <section className="pt-[70rem] max-md:pt-[40rem]">
          <div className="ctr">
            <div className="grd">
              <div style={{ gridColumn: "11 / span 5" }}>
                <Reveal>
                  <div className="t-b1 rise max-w-[46ch]">{lede}</div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
