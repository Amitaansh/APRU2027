import Link from "next/link";
import { LogoNUS } from "@/components/brand/Logos";
import { Social } from "@/components/brand/Social";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/content";

/**
 * A colophon, not a directory.
 *
 * It used to carry three bands — an ask with the CTA, a four-column route
 * listing, and the mark. The listing duplicated the navbar, which now carries
 * every route including the submenus, and the ask put a second copy of the one
 * call to action on every page. Both are gone: what is left is where we are on
 * the left, how to reach us on the right, and the mark.
 *
 * THE MARK is the last screen of every page on the site — four serif capitals
 * gutter to gutter, with the halo docked behind them, turning. It is the one
 * element on the site the halo is allowed to sit UNDER; see `.mark` and the
 * `footer .ctr` stacking rule in globals.css, and THE DOCK in Halo.tsx.
 *
 * Structure is load-bearing beyond layout: the halo reads this footer's FIRST
 * `.ctr` as the bottom guard rail for every lane on every page (Halo's `step`,
 * which takes `querySelector`). There are two containers, with the mark between
 * them, and the first one still opens directly below the same `pt-[160rem]` —
 * which is what keeps that rail where it has always been.
 *
 * It is also the site's one permanently dark surface, which is why every page
 * has to arrive here already dark. See the curtain on the homepage.
 */

const WORDMARK = ["A", "P", "R", "U"];

export function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <footer
      data-ground="dark"
      className="pb-[38rem] pt-[160rem] max-md:pb-[24rem] max-md:pt-[80rem]"
    >
      <div className="ctr">
        {/*
         * One band. Venue left, contact right — set as a single row on the
         * fifteen rather than as columns, because two facts do not make a
         * directory.
         */}
        <Reveal className="grd pb-[40rem] max-md:pb-[30rem]">
          <div className="ftr-venue rise">
            <LogoNUS />
            <p className="t-b2 dim pt-[20rem]">
              Kent Ridge campus, {site.location}
            </p>
          </div>

          <div
            className="ftr-reach rise flex flex-col items-end gap-[18rem] max-md:items-start max-md:pt-[40rem]"
            style={{ transitionDelay: "0.1s" }}
          >
            {contactEmail ? (
              <a href={"mailto:" + contactEmail} className="t-b1 link">
                {contactEmail}
              </a>
            ) : (
              <Link href="/contact" className="t-b1 link">
                Contact us
              </Link>
            )}
            <Social />
          </div>
        </Reveal>
      </div>

      {/*
       * The mark, and it sits OUTSIDE the container on purpose. It blends
       * against the halo canvas, and a blend only reaches as far as its nearest
       * stacking context — inside `.ctr`, which is one, it would find nothing
       * but the footer's own contents behind it. So it carries `.ctr`'s gutters
       * itself instead. See BLEND in globals.css.
       *
       * `.ln-mask` is `display: block; overflow: hidden` in the components layer
       * and Tailwind's `flex` overrides only the display, so the clip survives
       * and each letter arrives with the same rise every other line of display
       * type on the site uses — no new animation mechanism, and reduced motion
       * is already handled.
       */}
      <Reveal dock className="mark ln-mask mt-[200rem] flex justify-between max-md:mt-[100rem]">
        {WORDMARK.map((letter, i) => (
          <span key={letter} className="wd" style={{ transitionDelay: i * 0.09 + "s" }}>
            {letter}
          </span>
        ))}
      </Reveal>

      <div className="ctr">
        <Reveal className="grd ftr-meta t-b2 dim rise pt-[40rem] max-md:pt-[24rem] max-md:leading-[1.6]">
          <p>{site.seriesName}</p>
          <p>{site.host}</p>
          <p>
            {site.dates} &middot; {site.location}
          </p>
          <p className="tnum">
            &copy; {new Date(site.dateStart).getFullYear()} {site.hostShort}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
