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
 * THE SCRIM IS NOT DECORATION. The artwork is saffron and cerulean at roughly
 * equal luminance — white on the saffron measures about 2:1, which is nowhere
 * near the 4.5:1 the site holds itself to. The gradient underneath the type is
 * what buys the contrast, and it is why the type sits at the bottom: that is
 * where the scrim is densest and where a gradient reads as a natural falloff
 * rather than as a grey box laid over a picture.
 *
 * The stops are set against the band's height, not chosen for their own sake.
 * The type occupies the bottom ~23% of a full-viewport frame, so the gradient
 * clears by 52% and the artwork above it is untouched. Held at the old 72% it
 * would read as a vignette over most of the picture rather than as a footing under
 * the words. White over the brightest saffron at the top of the heading still
 * measures about 5.6:1.
 *
 * NO CLOSING RULE. PageHead draws a hairline under its title to close the
 * opening. Here the artwork's own bottom edge does that, and a black rule
 * directly beneath a photograph reads as a seam rather than as a gesture.
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
  return (
    <>
      {/* Padded rather than offset, so the band starts where the fixed header
          ends instead of running behind it. */}
      <section className="pt-[var(--hdr)]">
        <div className="relative flex h-[calc(100svh-var(--hdr))] w-full items-end overflow-hidden">
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

          {/*
           * Inline rather than an arbitrary `bg-[...]`: Tailwind reads a bare
           * linear-gradient there as a colour, finds it is not one, and emits
           * no rule at all -- the class lands in the HTML and nothing happens.
           * A gradient this long is also easier to read unescaped.
           */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.42) 22%, transparent 52%)",
            }}
          />

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
