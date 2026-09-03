import Link from "next/link";
import { LogoNUS } from "@apru/ui";
import { Social } from "@apru/ui";
import { Reveal } from "@apru/ui";
import { site } from "@apru/content";

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
  // Content, not env: the navbar no longer carries Contact, so this is the
  // site's primary contact affordance and cannot depend on a variable being set
  // at deploy time. NEXT_PUBLIC_CONTACT_EMAIL still overrides it if present.
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;

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
          {/*
           * The department, not the conference venue. This address is SDE1,
           * where the Department of Architecture sits; the conference itself is
           * in SDE3, which /visitors carries. Both are on Architecture
           * Drive, which is exactly why they are worth keeping apart.
           */}
          <div className="ftr-venue rise">
            <a
              href="https://cde.nus.edu.sg/arch/"
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <LogoNUS />
            </a>
            <address className="t-b2 dim not-italic pt-[20rem] leading-[1.6]">
              National University of Singapore
              <br />
              College of Design and Engineering
              <br />
              4 Architecture Drive, SDE1 #03-01
              <br />
              Singapore 117 566
              <br />
              <a href="tel:+6565168736" className="link">
                +65 6516 8736
              </a>
            </address>
          </div>

          <div
            className="ftr-reach rise flex flex-col items-end gap-[18rem] max-md:items-start max-md:pt-[40rem]"
            style={{ transitionDelay: "0.1s" }}
          >
            <a href={"mailto:" + contactEmail} className="t-b1 link">
              {contactEmail}
            </a>
            {/*
             * Contact came out of the navbar at the client's request, and this
             * footer deliberately carries no route listing — so without this
             * line the FAQ would be reachable only from the sitemap.
             */}
            <Link href="/contact" className="t-b2 link">
              Contact and FAQ
            </Link>
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
