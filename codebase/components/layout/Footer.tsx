"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { LogoNUS } from "@/components/brand/Logos";
import { Reveal } from "@/components/motion/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { nav, site } from "@/lib/content";
import { pageKeyFor } from "@/lib/routes";
import { usePhase } from "@/lib/usePhase";

/**
 * App Flow §2 — the footer carries the always-present CTA and lists all eight
 * routes regardless of phase, which is what keeps the de-emphasized pages
 * reachable while they are out of the primary nav.
 *
 * It is the site's one permanently dark surface, and it reads as three bands:
 * the ask, the directory, and the mark. Column headings are set in the serif at
 * text size, which is the reference's signature: a small serif word standing
 * beside sans data, instead of an uppercase mono caption.
 *
 * THE MARK is the last screen of every page on the site — four serif capitals
 * gutter to gutter, with the halo docked behind them, turning. It is the one
 * element on the site the halo is allowed to sit UNDER; see `.mark` and the
 * `footer .ctr` stacking rule in globals.css, and THE DOCK in Halo.tsx.
 *
 * Structure is load-bearing beyond layout: the halo reads this footer's FIRST
 * `.ctr` as the bottom guard rail for every lane on every page (Halo's `step`,
 * which takes `querySelector`). There are two containers now, with the mark
 * between them, and the first one still opens directly below the same
 * `pt-[160rem]` — which is what keeps that rail where it has always been.
 */

const WORDMARK = ["A", "P", "R", "U"];

export function Footer() {
  const pathname = usePathname();
  const { cta } = usePhase();
  const page = pageKeyFor(pathname);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  /*
   * Four label/list pairs, against the reference's Navigation / Media /
   * Address / Hours. Navigation is every route in nav.json rather than a
   * curated subset — this is the one place nothing may be unreachable — and
   * the rest is read out of site.json, so no fact is spelled twice.
   */
  const directory: { heading: string; items: ReactNode[] }[] = [
    {
      heading: "Navigation",
      items: nav.map((item) => (
        <Link key={item.route} href={item.route} className="t-b2 link">
          {item.label}
        </Link>
      )),
    },
    {
      heading: "Connect",
      items: [
        ...(contactEmail
          ? [
              <a key="email" href={"mailto:" + contactEmail} className="t-b2 link">
                Email
              </a>,
            ]
          : []),
        <Link key="contact" href="/contact" className="t-b2 link">
          Contact
        </Link>,
      ],
    },
    {
      heading: "Venue",
      items: [
        <Link key="venue" href="/venue" className="t-b2 link">
          Kent Ridge campus
        </Link>,
        <p key="host" className="t-b2">
          {site.hostShort}
        </p>,
        <p key="location" className="t-b2">
          {site.location}
        </p>,
      ],
    },
    {
      heading: "Dates",
      items: [
        <p key="dates" className="t-b2 tnum">
          {site.dates}
        </p>,
        <p key="series" className="t-b2">
          {site.seriesName}
        </p>,
      ],
    },
  ];

  return (
    <footer
      data-ground="dark"
      className="pb-[38rem] pt-[160rem] max-md:pb-[24rem] max-md:pt-[80rem]"
    >
      <div className="ctr">
        {/* Band one: the ask. */}
        <Reveal className="grd pb-[100rem] max-md:pb-[50rem]">
          <div className="ftr-ask rise">
            <p className="t-lbl dim pb-[26rem]">Get in touch</p>
            {contactEmail ? (
              <a href={"mailto:" + contactEmail} className="t-h3 link">
                {contactEmail}
              </a>
            ) : (
              <Link href="/contact" className="t-h3 link">
                Contact the committee
              </Link>
            )}
          </div>

          <div
            className="ftr-cta rise flex flex-wrap items-end gap-[16rem] max-md:pt-[40rem]"
            style={{ transitionDelay: "0.12s" }}
          >
            <CTAButton page={page} surface="footer" />
            {cta.secondary && (
              <CTAButton page={page} surface="footer" variant="secondary" target={cta.secondary} />
            )}
          </div>
        </Reveal>

        <div className="rule" />

        {/* Band two: the directory. */}
        <Reveal className="grd ftr-dir pt-[60rem] max-md:pt-[40rem]">
          <div className="ftr-brand rise">
            <Link
              href="/"
              className="block text-[19rem] leading-none tracking-[-0.02em] [font-weight:500] max-md:text-[16rem]"
            >
              <span className="block">APRU</span>
              <span className="block">Sustainable Cities</span>
              <span className="f-serif block">&amp; Landscapes</span>
            </Link>
            <LogoNUS className="pt-[44rem] max-md:pt-[28rem]" />
          </div>

          {directory.map((column, i) => (
            <Fragment key={column.heading}>
              <p
                className={"t-lbl dim rise ftr-lbl-" + (i + 1)}
                style={{ transitionDelay: 0.06 + i * 0.05 + "s" }}
              >
                {column.heading}
              </p>
              <div
                className={"rise flex flex-col gap-[10rem] ftr-list-" + (i + 1)}
                style={{ transitionDelay: 0.1 + i * 0.05 + "s" }}
              >
                {column.items}
              </div>
            </Fragment>
          ))}
        </Reveal>

      </div>

      {/*
       * Band three: the mark, and it sits OUTSIDE the container on purpose. It
       * blends against the halo canvas, and a blend only reaches as far as its
       * nearest stacking context — inside `.ctr`, which is one, it would find
       * nothing but the footer's own contents behind it. So it carries `.ctr`'s
       * gutters itself instead. See BLEND in globals.css.
       *
       * `.ln-mask` is `display: block; overflow: hidden` in the components layer
       * and Tailwind's `flex` overrides only the display, so the clip survives
       * and each letter arrives with the same rise every other line of display
       * type on the site uses — no new animation mechanism, and reduced motion
       * is already handled.
       */}
      <Reveal dock className="mark ln-mask mt-[300rem] flex justify-between max-md:mt-[100rem]">
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
