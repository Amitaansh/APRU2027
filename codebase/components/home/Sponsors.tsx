import { Reveal } from "@/components/motion/Reveal";
import { sponsors } from "@/lib/content";

/**
 * The sponsor and partner marks.
 *
 * Every logo is written monochrome and to a matched optical area by
 * `npm run imagery` — see buildSponsors there for why equal area rather than
 * equal height, and why the marks are curved to black rather than silhouetted.
 * Nothing here corrects for the source files; if a mark looks wrong, the fix is
 * in the pipeline, not in this markup.
 *
 * The row is a wrapping flex rather than a grid so that a sixth or seventh
 * partner drops in without a column count to maintain.
 *
 * ONE BOX FOR ALL FIVE, and that is load-bearing rather than lazy. Every file
 * is the same canvas with the mark centred inside it at its matched area, so
 * equal boxes here render as equal optical weight. Sizing these by height —
 * the obvious thing to write — would undo the pipeline's work and blow the wide
 * marks up to three times the area of the tall ones.
 */
export function Sponsors() {
  if (sponsors.length === 0) return null;

  return (
    <Reveal>
      <ul className="rise flex flex-wrap items-center gap-x-[30rem] gap-y-[24rem] max-md:gap-x-[16rem]">
        {sponsors.map((sponsor, i) => {
          const mark = (
            <picture className="block">
              <source srcSet={"/images/sponsors/" + sponsor.slug + ".webp"} type="image/webp" />
              <img
                src={"/images/sponsors/" + sponsor.slug + ".png"}
                alt={sponsor.name}
                width={640}
                height={400}
                loading="lazy"
                decoding="async"
                className="block w-full"
              />
            </picture>
          );
          return (
            <li
              key={sponsor.slug}
              className="w-[190rem] max-md:w-[124rem]"
              style={{ transitionDelay: Math.min(i * 0.06, 0.3) + "s" }}
            >
              {sponsor.url ? (
                <a href={sponsor.url} target="_blank" rel="noreferrer" className="block">
                  {mark}
                </a>
              ) : (
                mark
              )}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
