import Link from "next/link";
import { site } from "@apru/content";

/**
 * The home page, stripped to what the client asked for: the image, the title,
 * and two ways in.
 *
 * WHAT CAME OFF IT. The theme statement, the intro paragraph, the
 * dates/location/host/series block and the sponsor belt have all gone to
 * /about — the client's note is explicit about the intro and the sponsors, and
 * the theme heading and the facts block were both marked for removal. What is
 * left is the arrangement their reference site uses: artwork, name, two
 * buttons.
 *
 * The two calls to action point at our own pages rather than at an external
 * platform. CTAButton exists for the outbound conversion and is deliberately
 * outbound-only; neither abstracts nor registration has a destination yet, and
 * a button that says "Call for abstracts" should open the page that explains
 * it. When the portal opens, that page is where the outbound CTA lives.
 *
 * The image sits below the header rather than under it. With a solid header
 * bar there is no blend to feed and no scrim to buy, so the title can be set
 * on paper underneath where it is simply legible.
 */
export default function HomePage() {
  return (
    <>
      <section className="pt-[var(--hdr)]">
        <picture>
          <source
            srcSet="/images/hero-1920.avif 1920w, /images/hero-1280.avif 1280w, /images/hero-768.avif 768w"
            type="image/avif"
            sizes="100vw"
          />
          <img
            src="/images/hero-768.webp"
            alt="Aerial terrain artwork in saffron over cerulean, the visual identity of the 10th APRU Sustainable Cities and Landscapes conference."
            className="h-[64vh] min-h-[320rem] w-full object-cover"
            width={1920}
            height={1080}
          />
        </picture>
      </section>

      <section className="pad-b pt-[70rem] max-md:pt-[40rem]">
        <div className="ctr">
          <div className="grd">
            <div style={{ gridColumn: "1 / span 9" }}>
              <h1 className="t-h2">{site.name}</h1>
              <p className="t-h4 pt-[24rem] max-md:pt-[16rem]">{site.subtitle}</p>
            </div>

            <div style={{ gridColumn: "11 / span 5" }} className="max-md:pt-[28rem]">
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
