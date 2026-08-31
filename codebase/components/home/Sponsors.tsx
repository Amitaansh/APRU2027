import { Reveal } from "@/components/motion/Reveal";
import { sponsors } from "@/lib/content";

/**
 * The sponsor and partner marks, as the foot band of the invitation screen.
 *
 * WHY IT IS NOT A SECTION OF ITS OWN. It was one, sitting between the facts and
 * the invitation, and the halo swept straight across it. A section that declares
 * no lane does not push the ring away — it removes the constraint on it, and the
 * ring crosses from the left lane to the right one through exactly that gap. In
 * the curtain's foot the marks sit inside the same content columns as the
 * statement, which is the one place on the page the ring cannot reach.
 *
 * Every logo is written monochrome and to a matched optical area by
 * `npm run imagery` — see buildSponsors there for why equal area rather than
 * equal height, and why the marks are curved to black rather than silhouetted.
 * Nothing here corrects for the source files; if a mark looks wrong, the fix is
 * in the pipeline, not in this markup. `.spon-mark` is what flips them to white
 * once the curtain goes dark; see [data-ground="dark"] in globals.css.
 *
 * ONE BOX FOR ALL FIVE, and that is load-bearing rather than lazy. Every file is
 * the same canvas with the mark centred inside it at its matched area, so equal
 * boxes here render as equal optical weight. Sizing these by height — the
 * obvious thing to write — would undo the pipeline's work and blow the wide
 * marks up to three times the area of the tall ones.
 *
 * The boxes divide the measure rather than taking a fixed width, and that is not
 * a preference either. The band lives in eight of the fifteen columns, which is
 * a fraction of the VIEWPORT — while rem stops shrinking below 1728px. A fixed
 * width that fits at 1920 therefore overruns at 1366 and wraps to a second row,
 * and the band grows upward into the headline. An equal flex basis cannot.
 *
 * The cap is in vh as well as rem for the mirror-image case: on a 21:9 window
 * the columns are wide and the screen is not, and marks sized off the width
 * alone would take a third of the height of a face that has none to spare.
 */
export function Sponsors() {
  if (sponsors.length === 0) return null;

  return (
    <Reveal>
      <p className="t-lbl dim rise">Sponsors and partners</p>

      <ul className="flex flex-wrap items-center gap-x-[24rem] gap-y-[20rem] pt-[24rem] max-md:gap-x-[16rem]">
        {sponsors.map((sponsor, i) => {
          const mark = (
            <picture className="spon-mark block">
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
              /* The stagger has to sit on the element that carries .rise, which
               * is the one that transitions — on the list it delayed nothing. */
              className="rise min-w-0 max-w-[min(150rem,13vh)] flex-1 max-md:w-[100rem] max-md:max-w-none max-md:flex-none"
              style={{ transitionDelay: Math.min(0.08 + i * 0.06, 0.4) + "s" }}
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
