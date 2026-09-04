import Link from "next/link";
import { site } from "@apru/content";

/**
 * The home page is the designer's poster, full bleed, and nothing on top of it.
 *
 * WHAT CHANGED. The title and subtitle used to be set here in HTML under a
 * plain band of artwork. The 3 Sep key art draws them into the file itself --
 * "Bridging Resilience(s)", the series line, the dates, and the official APRU
 * and NUS lockups are all pixels now -- so setting them again in type would be
 * saying the same four things twice, once at the designer's size and once at
 * ours. They come off, and the image carries the page.
 *
 * WHICH LEAVES THE HEADING PROBLEM. Type inside an image is invisible to a
 * screen reader, to a search engine and to anyone who blocks images, so the
 * <h1> below stays -- it is simply not painted. That is also why the image
 * itself takes alt="": the heading already says the words, and giving them to
 * the image too means hearing the title, then hearing it again.
 *
 * ORIENTATION, NOT BREAKPOINT. The frame is 16:9 with the type across its top
 * left and the logos across its bottom left, so a portrait crop tight enough
 * for a phone cuts through both. Landscape gets the poster at full height,
 * anchored left so that a very wide window trims the empty right side rather
 * than the words. Portrait gets a band taken from the RIGHT of the frame --
 * the half that is pure artwork -- with the title set in live type below it,
 * which is the arrangement this page had before. Nothing is ever shown
 * half-cropped.
 *
 * That portrait branch is interim. The designer is cutting a portrait
 * composition; when it lands, buildHomePortrait writes home-portrait-*, a
 * <source media="(orientation: portrait)"> goes in below, and the live-type
 * block comes out.
 */
export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        {site.name} — {site.subtitle}. {site.dates}, {site.location}.
      </h1>

      <section className="pt-[var(--hdr)]">
        <picture>
          <source
            srcSet="/images/home-2560.avif 2560w, /images/home-1920.avif 1920w, /images/home-1280.avif 1280w, /images/home-768.avif 768w"
            type="image/avif"
            sizes="100vw"
          />
          <img
            src="/images/home-1280.webp"
            srcSet="/images/home-1920.webp 1920w, /images/home-1280.webp 1280w, /images/home-768.webp 768w"
            sizes="100vw"
            alt=""
            width={2560}
            height={1440}
            className="h-[38svh] w-full object-cover object-right landscape:h-[calc(100svh-var(--hdr))] landscape:object-left"
          />
        </picture>
      </section>

      <section className="pad-b pt-[70rem] max-md:pt-[40rem]">
        <div className="ctr">
          {/*
           * The live-type title, portrait only. aria-hidden because the real
           * heading is the sr-only <h1> above -- without it the title is
           * announced twice on a phone and once on a laptop, which is a
           * difference no one should be able to hear.
           */}
          <div aria-hidden="true" className="pb-[54rem] landscape:hidden">
            <p className="t-h2">{site.name}</p>
            <p className="t-h4 pt-[24rem] max-md:pt-[16rem]">{site.subtitle}</p>
          </div>

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
