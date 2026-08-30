import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/content";

/**
 * The supplied key art, full bleed, with the title sitting on it.
 *
 * The artwork is the only colour event above the fold — everything below this
 * section is monochrome. It is the art exactly as supplied, cerulean and
 * saffron, with no treatment over it: the dither this used to run through
 * rebuilt its palette out of a greyscale and lost the colour that makes it the
 * statement. The title is deliberately not set at display scale here: the image
 * is the statement, and the big type arrives in the section after it.
 *
 * The title is set in white directly on the artwork, which is dark enough across
 * its full area to carry it, and takes no scrim of its own.
 *
 * The band at the top is a different matter. The header inverts itself with
 * `mix-blend-mode: difference`, and a difference against a mid-tone returns
 * another mid-tone -- so the wordmark and the nav dissolved into the artwork.
 * `.hero-scrim` darkens only the strip they sit in, which is what gives the
 * blend something to invert against. It lives inside the clip so it arrives with
 * the band rather than washing the paper the preloader is still retracting from.
 *
 * The artwork arrives as a band. `.hero-clip` is closed to a zero-height sliver
 * at the centre line until the preloader's two panels split, and opens to full
 * bleed as they retract -- so what the loading screen uncovers is this image
 * widening, not a finished hero sitting behind it. The title waits for the same
 * signal (`gate="entered"`) rather than for fonts, or it would spend its rise
 * behind a white panel. See components/motion/Preloader.tsx.
 */
export function Hero() {
  return (
    <section data-hero className="relative h-screen min-h-[560rem] w-full overflow-hidden">
      <div className="hero-clip">
        <picture>
          <source
            srcSet="/images/hero-1920.avif 1920w, /images/hero-1280.avif 1280w, /images/hero-768.avif 768w"
            type="image/avif"
            sizes="100vw"
          />
          <img
            src="/images/hero-768.webp"
            alt="Aerial terrain artwork in saffron over cerulean — the visual identity of the 10th APRU Sustainable Cities and Landscapes conference."
            className="absolute inset-0 size-full object-cover"
            width={1920}
            height={1080}
          />
        </picture>

        <div aria-hidden="true" className="hero-scrim" />
      </div>

      <div className="ctr relative z-[2] flex h-full flex-col justify-end pb-[38rem] max-md:pb-[20rem]">
        <div className="flex items-end justify-between gap-[20rem] text-wh max-md:flex-col max-md:items-start max-md:gap-[24rem]">
          <div>
            <MaskLines
              as="h1"
              gate="entered"
              className="t-h3"
              lines={["Bridging", "Resilience(s)"]}
            />
            {/* The full conference name. The title above is the theme, which is
                the statement; this is what the theme is attached to, and it is
                far too long to be set at display size. */}
            <Reveal gate="entered" className="t-b2 rise pt-[18rem] max-md:pt-[12rem]">
              <p className="max-w-[34ch]">{site.subtitle}</p>
            </Reveal>
          </div>
          <Reveal gate="entered" className="t-b2 rise text-right max-md:text-left">
            <p>{site.dates}</p>
            <p>{site.hostShort}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
