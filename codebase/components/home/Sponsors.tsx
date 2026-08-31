import { Belt } from "@/components/motion/Belt";
import { Reveal } from "@/components/motion/Reveal";
import { sponsors } from "@/lib/content";

/**
 * The sponsor and partner marks, as a belt that drifts across the foot of the
 * page and quickens as you scroll. See components/motion/Belt.tsx for the loop.
 *
 * WHY IT IS ITS OWN <section> AND NOT A <Section>. Section wraps its children in
 * `.ctr`, whose 30rem gutters are exactly what a belt must not have: the marks
 * have to run off both edges of the screen or the thing reads as a widget in a
 * box rather than as a strip passing through. So the label keeps a `.ctr` of its
 * own and the belt sits outside it, full width, needing no negative margins.
 *
 * THAT `.ctr` IS LOAD-BEARING and not just for the label's gutters. The halo
 * finds its lower guard rail by walking `nextElementSibling` from the last lane
 * section (#join) and taking `querySelector(".ctr")` off whatever it lands on,
 * which is this section; the ring's y is then clamped to that element's top.
 * Remove the `.ctr` and the rail silently moves up to the section box, and the
 * departing ring is free to sweep across this type. See guards.below and the
 * clamp in components/brand/Halo.tsx.
 *
 * Every logo is written monochrome and to a matched optical area by
 * `npm run imagery` -- see buildSponsors there for why equal area rather than
 * equal height, and why the marks are curved to black rather than silhouetted.
 * Nothing here corrects for the source files; if a mark looks wrong, the fix is
 * in the pipeline, not in this markup. `.spon-mark` is what flips them to white
 * on the dark ground; see [data-ground="dark"] in globals.css.
 *
 * ONE BOX FOR ALL FIVE, and that is load-bearing rather than lazy. Every file is
 * the same canvas with the mark centred inside it at its matched area, so equal
 * boxes here render as equal optical weight. Sizing these by height -- the
 * obvious thing to write -- would undo the pipeline's work and blow the wide
 * marks up to three times the area of the tall ones. `.spon-cell` is that box,
 * and it is a fixed width because a belt has no measure to divide.
 */

/*
 * Enough copies that the track is always at least one set wider than the screen,
 * which is what the wrap in Belt.tsx needs to stay invisible. A set is about
 * 1500rem, so four of them cover a viewport up to 4K and there is no arithmetic
 * to redo unless the roster or the cell width changes. The marks are five URLs
 * however many times they appear, so the copies cost no extra requests.
 */
const SETS = 4;

export function Sponsors() {
  if (sponsors.length === 0) return null;

  /*
   * Only the first set is real. The copies are decoration for a screen reader
   * and for the tab order -- hence aria-hidden and tabIndex -1 -- but they stay
   * clickable, because at any given moment the mark under the cursor is far
   * more likely to be a copy than the original. `inert` would say all of this in
   * one attribute and is the wrong tool for exactly that reason: it kills
   * pointer events too.
   */
  const renderSet = (copy: number) => (
    <ul key={copy} className="spon-set" aria-hidden={copy > 0 || undefined}>
      {sponsors.map((sponsor) => {
        const mark = (
          <picture className="spon-mark block">
            <source srcSet={"/images/sponsors/" + sponsor.slug + ".webp"} type="image/webp" />
            <img
              src={"/images/sponsors/" + sponsor.slug + ".png"}
              alt={copy > 0 ? "" : sponsor.name}
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </picture>
        );
        return (
          <li key={sponsor.slug}>
            {sponsor.url ? (
              <a
                href={sponsor.url}
                target="_blank"
                rel="noreferrer"
                tabIndex={copy > 0 ? -1 : undefined}
                className="spon-cell block"
              >
                {mark}
              </a>
            ) : (
              <span className="spon-cell block">{mark}</span>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    /*
     * Dark, because the curtain has already gone black and the footer below is
     * permanently so; a light section here would be a hole in the run. And the
     * pads are a fraction of `.pad`'s 180: this band sits between a screen that
     * ends in its own centred whitespace and a footer that opens with 160 of its
     * own, so the section's share of that run has to be small. The footer gives
     * up most of its own top pad in turn -- see the :has() rule in globals.css.
     */
    <section
      id="sponsors"
      data-ground="dark"
      className="pt-[72rem] pb-[32rem] max-md:pt-[56rem] max-md:pb-[24rem]"
    >
      <Reveal>
        <div className="ctr">
          <p className="t-lbl dim rise text-center">Sponsors and partners</p>
        </div>

        {/* The rise is on the belt as a whole, not on the marks: a staggered
         * entrance means nothing on things that are about to slide anyway. The
         * two transforms are on different elements and never meet. */}
        <Belt className="spon-belt rise mt-[36rem] max-md:mt-[28rem]">
          {Array.from({ length: SETS }, (_, i) => renderSet(i))}
        </Belt>
      </Reveal>
    </section>
  );
}
