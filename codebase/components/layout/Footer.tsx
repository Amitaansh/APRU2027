"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoAPRU, LogoNUS } from "@/components/brand/Logos";
import { CTAButton } from "@/components/ui/CTAButton";
import { Container } from "@/components/ui/Container";
import { nav, site } from "@/lib/content";
import { pageKeyFor } from "@/lib/routes";
import { usePhase } from "@/lib/usePhase";

/**
 * App Flow §2 — the footer carries the always-present CTA and lists all eight
 * routes regardless of phase, which is what keeps the de-emphasized pages
 * reachable while they are out of the primary nav.
 */
export function Footer() {
  const pathname = usePathname();
  const { cta } = usePhase();
  const page = pageKeyFor(pathname);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <footer className="border-t border-line bg-surface">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-12 md:gap-5 md:py-[88px]">
          <div className="md:col-span-7">
            <p className="font-display text-[clamp(2rem,7vw,4.5rem)] font-black leading-[0.85]">
              Bridging
              <br />
              Resilience(s)
            </p>
            <p className="label-mono mt-6">
              {site.dates} &middot; {site.location} &middot; {site.seriesName}
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="label-mono mb-4">Stay informed</p>
            <div className="flex flex-wrap gap-3">
              <CTAButton page={page} surface="footer" />
              {cta.secondary && (
                <CTAButton page={page} surface="footer" variant="secondary" target={cta.secondary} />
              )}
            </div>

            <nav aria-label="Footer" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
              {nav.map((item) => (
                <Link
                  key={item.route}
                  href={item.route}
                  className="label-mono transition-colors duration-[180ms] hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-line py-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-end gap-10">
            <LogoAPRU />
            <LogoNUS />
          </div>
          <div className="label-mono flex flex-col gap-2 md:items-end">
            {contactEmail ? (
              <a href={"mailto:" + contactEmail} className="hover:text-ink">
                {contactEmail}
              </a>
            ) : (
              <Link href="/contact" className="hover:text-ink">
                Contact the organising committee
              </Link>
            )}
            <span>
              &copy; {new Date(site.dateStart).getFullYear()} {site.hostShort}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
