"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CTAButton } from "@/components/ui/CTAButton";
import { Container } from "@/components/ui/Container";
import { hasSpeakers, nav, site } from "@/lib/content";
import { isInPrimaryNav } from "@/lib/phase";
import { pageKeyFor } from "@/lib/routes";
import { usePhase } from "@/lib/usePhase";

/**
 * The navbar grows with the site (App Flow §4): four content-bearing items at
 * launch, promoting Register at P1, Call for Abstracts at P2, and Speakers the
 * moment a keynote lands. The footer always lists everything, so a
 * de-emphasized page is never unreachable.
 *
 * The row has a reserved height and promoted items fade in, so a promotion
 * never reflows the page under the visitor.
 */
export function Header() {
  const pathname = usePathname();
  const { phase } = usePhase();
  // The menu is scoped to the route it was opened on, so a navigation closes
  // it without an effect reaching back into state.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const items = nav.filter((item) =>
    isInPrimaryNav(item, phase, item.route === "/speakers" ? hasSpeakers : undefined),
  );

  const isCurrent = (route: string) => {
    const here = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    return here === route;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <Container>
        {/* Design Brief §07.01 — mono status bar. */}
        <div className="label-mono hidden justify-between border-b border-line py-2 md:flex">
          <span>[ 01&deg;17&prime;N 103&deg;50&prime;E ] {site.location}</span>
          <span>{site.host}</span>
          <span>{site.dates}</span>
        </div>

        <div className="flex min-h-[72px] items-center justify-between gap-6 py-3">
          <Link href="/" className="font-display text-base font-black leading-none md:text-lg">
            APRU-SCL <span className="text-accent">2027</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <Link
                key={item.route}
                href={item.route}
                aria-current={isCurrent(item.route) ? "page" : undefined}
                className={
                  "label-mono transition-colors duration-[180ms] hover:text-ink " +
                  (isCurrent(item.route) ? "text-ink" : "")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden lg:block">
              <CTAButton page={pageKeyFor(pathname)} surface="hero" className="px-4 py-2 text-sm" />
            </div>
            <button
              type="button"
              onClick={() => setOpenPath(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="border border-line p-2 text-ink md:hidden"
            >
              {open ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper md:hidden">
          <Container>
            <nav aria-label="Primary mobile" className="flex flex-col py-4">
              {items.map((item) => (
                <Link
                  key={item.route}
                  href={item.route}
                  aria-current={isCurrent(item.route) ? "page" : undefined}
                  className="border-b border-line py-4 font-display text-lg font-bold"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-5">
                <CTAButton page={pageKeyFor(pathname)} surface="hero" />
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
