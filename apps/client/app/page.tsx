import Link from "next/link";
import { KeyVisual } from "@apru/ui";
import { site } from "@apru/content";

/**
 * The home page: the designer's key visual, assembled rather than flattened.
 *
 * WHAT CHANGED. This page used to be the comp as a picture. The 3 Sep key art
 * drew the title, the series line, the dates and both official lockups into the
 * file itself, so the page shipped them as pixels and carried an sr-only <h1>
 * alongside to say the same four things again for anyone who could not see them.
 *
 * That is gone. <KeyVisual> keeps the artwork as an image and rebuilds
 * everything in it that carries meaning — the title as a real <h1> in Atlas
 * Grotesk, the dates as real text, the lockups as linked SVG — set to geometry
 * measured off the comp's vector master rather than judged by eye. The heading
 * is now the heading, so there is nothing to duplicate and nothing to hide.
 *
 * ORIENTATION, NOT BREAKPOINT, still. The frame is 16:9 with the type across its
 * top left and the lockups across its bottom left, so a portrait crop tight
 * enough for a phone cuts through both. It is no longer cropped at all: portrait
 * re-sets the same composition on the same tokens against a sublinear ramp, over
 * a portrait cut of the plate. Nothing is ever shown half-cropped, and the
 * interim "artwork above, live type below" arrangement this page used to fall
 * back to on phones is no longer needed.
 */
export default function HomePage() {
  return (
    <>
      <section className="pt-[var(--hdr)]">
        <div className="h-[calc(100svh-var(--hdr))]">
          <KeyVisual />
        </div>
      </section>

      <section className="pad-b pt-[70rem] max-md:pt-[40rem]">
        <div className="ctr">
          <div className="grd">
            <div style={{ gridColumn: "1 / span 9" }}>
              <p className="t-b1">
                {site.dates}
                <br />
                {site.venueAddress}
                <br />
                {site.hostShort}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-[14rem] pt-[54rem] max-md:pt-[34rem]">
            <Link href="/call-for-abstracts" className="btn btn-fill">
              Call for abstracts
            </Link>
            <Link href="/register" className="btn">
              Registration
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
