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
 * THE BAND, AND ITS CROP. It ran to the foot of the viewport at first. The
 * client asked to see a short band on one page, was shown a 400rem strip of
 * the artwork's middle, and chose it -- "I prefer this version of the main
 * graphic (shorter one)" -- with one correction: "let's crop from the top to
 * the middle". The sample they attached is three times as wide as it is tall
 * and shows the artwork from its top edge down. So that is the band on every
 * page now: `aspect-ratio: 3 / 1`, so the crop is the same slice at every
 * width rather than a height that changed the slice with every resize, and
 * `object-position: top`, so the slice starts at the top edge. The `band`
 * prop that carried the sample is gone with the choice.
 *
 * PORTRAIT ON A PHONE. "Check mobile version - maybe better to have the
 * portrait format graphic?" A 3:1 strip on a 390px screen is 130px tall, and a
 * two-line title fills it. The portrait cut of the same plate that the home
 * page uses is served below 768px instead, at 4:5, which is a graphic in its
 * own right rather than a strip and holds a title like STUDENT NETWORK SESSION
 * with room to spare.
 *
 * THE LABEL CAN BE THE TITLE. On About the label is "About" and so is the
 * title, and the client asked for the first one to be "transparent colour,
 * make it not visible". It is rendered invisible rather than omitted, so the
 * title sits at the same height on About as on every other page.
 */
export function PageHeadArt({
  label,
  title,
  lede,
}: {
  label: string;
  title: string[];
  lede?: ReactNode;
}) {
  const redundantLabel = label.trim().toLowerCase() === title.join(" ").trim().toLowerCase();

  return (
    <>
      {/* Padded rather than offset, so the band starts where the fixed header
          ends instead of running behind it.

          `.pg-art` is a hook, not a style: the client's stylesheet uses it to
          close the gap between this band and the first paragraph under it. See
          the rule beside it in apps/client/app/globals.css. */}
      <section className="pg-art pt-[var(--hdr)]">
        <div className="relative flex aspect-[3/1] w-full items-end overflow-hidden max-md:aspect-[4/5]">
          <picture>
            {/* The portrait plates first: a <picture> takes the first source
                whose media matches, so the phone cut has to be offered before
                the landscape one. */}
            <source
              media="(max-width: 767.98px)"
              srcSet="/images/home-portrait-1080.avif 1080w, /images/home-portrait-768.avif 768w, /images/home-portrait-480.avif 480w"
              type="image/avif"
              sizes="100vw"
            />
            <source
              media="(max-width: 767.98px)"
              srcSet="/images/home-portrait-1080.webp 1080w, /images/home-portrait-768.webp 768w, /images/home-portrait-480.webp 480w"
              type="image/webp"
              sizes="100vw"
            />
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
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </picture>

          <div className="ctr relative w-full pb-[28rem] text-wh max-md:pb-[20rem]">
            <Reveal className="rise pb-[8rem] max-md:pb-[6rem]">
              <p
                className={"t-lbl" + (redundantLabel ? " invisible" : "")}
                aria-hidden={redundantLabel || undefined}
              >
                {label}
              </p>
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
