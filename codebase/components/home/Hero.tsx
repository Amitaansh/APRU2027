import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/content";

/**
 * The supplied key art, full bleed, with the title sitting on it.
 *
 * The artwork is the only colour event above the fold and the only place the
 * orange-over-blue dither appears at size — everything below this section is
 * monochrome. The title is deliberately not set at display scale here: the
 * image is the statement, and the big type arrives in the section after it.
 *
 * No scrim over the image. The header inverts itself with `mix-blend-mode` and
 * the title is set in white directly on the artwork, which is dark enough
 * across its full area to carry it.
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
            alt="Dithered terrain artwork in orange over blue — the visual identity of the 10th APRU Sustainable Cities and Landscapes conference."
            className="absolute inset-0 size-full object-cover"
            width={1920}
            height={1080}
          />
        </picture>
      </div>

      <div className="ctr relative z-[2] flex h-full flex-col justify-end pb-[38rem] max-md:pb-[20rem]">
        <div className="flex items-end justify-between gap-[20rem] text-wh max-md:flex-col max-md:items-start max-md:gap-[24rem]">
          <MaskLines
            as="h1"
            gate="entered"
            className="t-h3"
            lines={["Bridging", "Resilience(s)"]}
          />
          <Reveal gate="entered" className="t-b2 rise text-right max-md:text-left">
            <p>{site.dates}</p>
            <p>{site.hostShort}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
