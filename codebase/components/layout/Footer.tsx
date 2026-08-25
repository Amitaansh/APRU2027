"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoAPRU, LogoNUS } from "@/components/brand/Logos";
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
 * It is the site's one permanently dark surface. Column headings are set in the
 * serif at text size, which is the reference's signature: a small serif word
 * standing beside sans data, instead of an uppercase mono caption.
 */

const COLUMNS = [
  { heading: "Conference", routes: ["/about", "/program", "/speakers", "/call-for-abstracts"] },
  { heading: "Attending", routes: ["/register", "/venue", "/contact"] },
];

export function Footer() {
  const pathname = usePathname();
  const { cta } = usePhase();
  const page = pageKeyFor(pathname);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const labelFor = (route: string) => nav.find((item) => item.route === route)?.label ?? route;

  return (
    <footer data-ground="dark" className="pb-[38rem] pt-[160rem] max-md:pb-[24rem] max-md:pt-[80rem]">
      <div className="ctr">
        <Reveal className="flex items-end justify-between gap-[40rem] pb-[120rem] max-md:flex-col max-md:items-start max-md:gap-[50rem] max-md:pb-[50rem]">
          <div className="rise">
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
            <div className="flex flex-wrap gap-[16rem] pt-[50rem]">
              <CTAButton page={page} surface="footer" />
              {cta.secondary && (
                <CTAButton page={page} surface="footer" variant="secondary" target={cta.secondary} />
              )}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="rise flex gap-[80rem] max-md:flex-wrap max-md:gap-[40rem]"
            style={{ transitionDelay: "0.12s" }}
          >
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-[10rem]">
                <p className="t-lbl dim pb-[8rem]">{column.heading}</p>
                {column.routes.map((route) => (
                  <Link key={route} href={route} className="t-b2 link">
                    {labelFor(route)}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </Reveal>

        <div className="rule" />

        <Reveal className="rise flex flex-wrap items-end gap-[80rem] py-[60rem] max-md:gap-[40rem] max-md:py-[40rem]">
          <LogoAPRU />
          <LogoNUS />
        </Reveal>

        <div className="rule" />

        <Reveal className="t-b2 dim rise flex justify-between gap-[20rem] pt-[26rem] max-md:flex-col max-md:gap-[10rem]">
          <p>{site.seriesName}</p>
          <p>{site.host}</p>
          <p className="tnum">
            &copy; {new Date(site.dateStart).getFullYear()} {site.hostShort}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
