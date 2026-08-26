"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hasSpeakers, nav, site } from "@/lib/content";
import { isInPrimaryNav } from "@/lib/phase";
import { usePhase } from "@/lib/usePhase";

/**
 * Fixed, with no background of its own.
 *
 * `mix-blend-mode: difference` over white text is what lets one header sit over
 * the artwork, over white sections and over black sections without any of them
 * knowing about it: the blend inverts against whatever is behind, so the header
 * is black on white and white on black for free. It is also why the header has
 * no theme logic even though the site goes dark.
 *
 * The blend only pays off against a ground near one end of the range. The hero
 * artwork is neither, so the hero darkens the strip the header sits in rather
 * than the header taking a state of its own -- see `.hero-scrim`. Both the
 * wordmark and the nav are set at 500 for the same reason: they have to hold
 * their shape over a dither. Switzer is loaded as a variable face, so that is a
 * real weight rather than a synthesised one, which `font-synthesis-weight: none`
 * would refuse to draw anyway.
 *
 * The blend has to be turned off while the mobile menu is open, because the menu
 * is a real surface and the header must sit on it normally rather than invert
 * against it.
 */
export function Header() {
  const pathname = usePathname();
  const { phase } = usePhase();
  // Scoped to the route it was opened on, so navigating closes it without an
  // effect reaching back into state.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const items = nav.filter((item) =>
    isInPrimaryNav(item, phase, item.route === "/speakers" ? hasSpeakers : undefined),
  );

  const isCurrent = (route: string) => {
    const here = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    return here === route;
  };

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  return (
    <>
      <ScrollProgress />

      <header
        className={
          "fixed left-0 top-0 z-[60] w-full py-[24rem] text-wh max-md:py-[14rem] " +
          (open ? "" : "mix-blend-difference ") +
          "pointer-events-none"
        }
      >
        <div className="ctr flex w-full items-start justify-between">
          <Link href="/" className="pointer-events-auto block text-[19rem] leading-none tracking-[-0.02em] [font-weight:500] max-md:text-[14rem]">
            <span className="block">APRU</span>
            <span className="block">Sustainable Cities</span>
            <span className="f-serif block">&amp; Landscapes</span>
          </Link>

          {/*
           * Comma-separated, the way an index line is set. The comma belongs to
           * the link text so the underline sweep runs under it too.
           */}
          <nav aria-label="Primary" className="t-b2 pointer-events-auto max-md:hidden">
            <ul className="flex items-center gap-[0.5em] [font-weight:500]">
              {items.map((item, i) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    aria-current={isCurrent(item.route) ? "page" : undefined}
                    className="link"
                  >
                    {item.label}
                    {i < items.length - 1 ? "," : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="t-b2 pointer-events-auto hidden max-md:block"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[55] bg-wh px-[15rem] pb-[20rem] pt-[90rem] text-bk md:hidden"
        >
          <nav aria-label="Primary" className="flex h-full flex-col justify-end gap-[10rem]">
            {items.map((item) => (
              <Link
                key={item.route}
                href={item.route}
                aria-current={isCurrent(item.route) ? "page" : undefined}
                onClick={() => setOpenPath(null)}
                className="t-h3"
              >
                {item.label}
              </Link>
            ))}
            <p className="t-b2 dim mt-[30rem]">
              {site.dates} &middot; {site.location}
            </p>
          </nav>
        </div>
      )}
    </>
  );
}

/**
 * A 3px rule across the top that fills as the page is read. White under
 * `difference` rather than a flat black bar, so it inverts against whatever
 * section is at the top of the viewport instead of vanishing into a dark one.
 */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-[3rem] w-full origin-left bg-wh mix-blend-difference"
      style={{ transform: "scaleX(" + progress + ")" }}
    />
  );
}
