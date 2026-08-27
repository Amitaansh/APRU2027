"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import { isInPrimaryNav } from "@/lib/phase";
import type { NavItem } from "@/lib/types";
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
 *
 * WHY THE DROPDOWN IS NOT INSIDE THE HEADER. `mix-blend-mode` blends the
 * element's whole rendered result, children included -- there is no opting a
 * child out. An opaque panel inside this header would not read as a panel, it
 * would read as a rectangle of inverted page. So the panel is a SIBLING of
 * <header>, drawn unblended on a ground of its own and positioned against its
 * trigger's measured rect. That is the treatment the mobile menu already takes,
 * for the same reason.
 */
export function Header() {
  const pathname = usePathname();
  const { phase } = usePhase();
  // Scoped to the route it was opened on, so navigating closes it without an
  // effect reaching back into state.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  /**
   * Which submenu is down, by parent label, and where to draw it. Scoped to the
   * route it was opened on for the same reason the mobile menu is: navigating
   * closes it by making it stale, with no effect reaching back into state.
   */
  const [menu, setMenu] = useState<{
    label: string;
    x: number;
    y: number;
    path: string;
  } | null>(null);
  const down = menu?.path === pathname ? menu : null;
  const triggers = useRef(new Map<string, HTMLElement | null>());
  /**
   * Hover intent, shared by the trigger and the panel. They sit in different
   * subtrees, so a timer is the only thing that can join them: leaving either
   * starts it, entering either cancels it.
   */
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Labels expanded in the mobile panel, route-scoped the same way. */
  const [expanded, setExpanded] = useState<{ path: string; labels: string[] }>({
    path: "",
    labels: [],
  });
  const openLabels = expanded.path === pathname ? expanded.labels : [];

  const items = nav.filter((item) => isInPrimaryNav(item, phase));

  const isCurrent = (route?: string) => {
    if (!route) return false;
    const here = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    return here === route;
  };

  /** A parent reads as current while the visitor is on any page beneath it. */
  const isWithin = (item: NavItem) =>
    isCurrent(item.route) || Boolean(item.children?.some((child) => isCurrent(child.route)));

  const openMenu = useCallback(
    (label: string) => {
      const el = triggers.current.get(label);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Docked to the trigger's bottom edge exactly. The panel pays its own top
      // padding rather than taking an offset, so there is no dead gap for the
      // pointer to cross on the way down.
      setMenu({ label, x: rect.left, y: rect.bottom, path: pathname });
    },
    [pathname],
  );

  const cancelClose = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    leaveTimer.current = setTimeout(() => setMenu(null), 140);
  }, [cancelClose]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  // Escape closes; so does a resize, which would otherwise leave the panel
  // drawn against a rect that no longer describes its trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      setOpenPath(null);
    };
    const onResize = () => setMenu(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => cancelClose, [cancelClose]);

  const current = down ? items.find((item) => item.label === down.label) : undefined;

  return (
    <>
      <ScrollProgress />

      <header
        className={
          "fixed left-0 top-0 z-[60] w-full py-[24rem] max-md:py-[14rem] " +
          // Open, the header sits on the menu's own white surface as a normal
          // element, so it has to carry the menu's ink -- left at text-wh with
          // the blend off it would be white on white, and the close control
          // would be invisible on the one screen that needs it.
          (open ? "text-bk " : "text-wh mix-blend-difference ") +
          "pointer-events-none"
        }
      >
        <div className="ctr flex w-full items-start justify-between">
          <Link
            href="/"
            className="pointer-events-auto block text-[19rem] leading-none tracking-[-0.02em] [font-weight:500] max-md:text-[14rem]"
          >
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
              {items.map((item, i) => {
                const comma = i < items.length - 1 ? "," : "";
                const isDown = down?.label === item.label;

                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.route ?? "/"}
                        aria-current={isCurrent(item.route) ? "page" : undefined}
                        className="link"
                        onMouseEnter={scheduleClose}
                      >
                        {item.label}
                        {comma}
                      </Link>
                    </li>
                  );
                }

                /*
                 * A parent with a page of its own stays a link, so the landing
                 * is reachable by click and by keyboard. One without a page is
                 * a button, because there is nowhere for it to go. Both open
                 * the same panel on hover and on focus.
                 */
                const setTrigger = (el: HTMLElement | null) => {
                  triggers.current.set(item.label, el);
                };

                return (
                  <li
                    key={item.label}
                    onMouseEnter={() => {
                      cancelClose();
                      openMenu(item.label);
                    }}
                    onMouseLeave={scheduleClose}
                  >
                    {item.route ? (
                      <Link
                        href={item.route}
                        ref={setTrigger}
                        aria-current={isWithin(item) ? "page" : undefined}
                        aria-expanded={isDown}
                        aria-haspopup="true"
                        className="link"
                        onFocus={() => openMenu(item.label)}
                      >
                        {item.label}
                        <span aria-hidden="true">&#8202;&#9662;</span>
                        {comma}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        ref={setTrigger}
                        aria-expanded={isDown}
                        aria-haspopup="true"
                        className="link"
                        onFocus={() => openMenu(item.label)}
                        onClick={() => (isDown ? setMenu(null) : openMenu(item.label))}
                      >
                        {item.label}
                        <span aria-hidden="true">&#8202;&#9662;</span>
                        {comma}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="pointer-events-auto relative hidden h-[16rem] w-[24rem] max-md:block"
          >
            <Hamburger open={open} />
          </button>
        </div>
      </header>

      {/* The submenu. Outside the header on purpose -- see the note above. */}
      {current?.children && down && (
        <div
          className="nav-menu fixed z-[58] max-md:hidden"
          style={{ left: down.x + "px", top: down.y + "px" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <ul className="flex flex-col gap-[14rem]">
            {current.children.map((child) => (
              <li key={child.route}>
                <Link
                  href={child.route ?? "/"}
                  aria-current={isCurrent(child.route) ? "page" : undefined}
                  className="t-b2 link whitespace-nowrap"
                  onClick={() => setMenu(null)}
                  onBlur={scheduleClose}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[55] overflow-y-auto bg-wh px-[15rem] pb-[20rem] pt-[80rem] text-bk md:hidden"
        >
          <nav aria-label="Primary" className="flex min-h-full flex-col justify-end gap-[10rem]">
            {items.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.route ?? "/"}
                    aria-current={isCurrent(item.route) ? "page" : undefined}
                    onClick={() => setOpenPath(null)}
                    className="t-h3"
                  >
                    {item.label}
                  </Link>
                );
              }

              const isOpen = openLabels.includes(item.label);

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpanded({
                        path: pathname,
                        labels: openLabels.includes(item.label)
                          ? openLabels.filter((label) => label !== item.label)
                          : [...openLabels, item.label],
                      })
                    }
                    className="t-h3 flex w-full items-baseline gap-[10rem] text-left"
                  >
                    {item.label}
                    <span aria-hidden="true" className="t-b2 dim">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-[10rem] pl-[16rem] pt-[14rem]">
                      {item.route && (
                        <Link
                          href={item.route}
                          onClick={() => setOpenPath(null)}
                          className="t-b1"
                        >
                          Overview
                        </Link>
                      )}
                      {item.children.map((child) => (
                        <Link
                          key={child.route}
                          href={child.route ?? "/"}
                          aria-current={isCurrent(child.route) ? "page" : undefined}
                          onClick={() => setOpenPath(null)}
                          className="t-b1"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <p className="t-b2 dim mt-[24rem]">
              {site.dates} &middot; {site.location}
            </p>
          </nav>
        </div>
      )}
    </>
  );
}

/**
 * Three rules that fold into a cross. Drawn in `currentColor` like every other
 * rule on the site, so it inverts with the header instead of carrying a colour
 * of its own.
 */
function Hamburger({ open }: { open: boolean }) {
  const bar =
    "absolute left-0 block h-[1.5rem] w-full bg-current transition-all duration-300 ease-[var(--ease-ref)]";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 block">
      <span
        className={bar}
        style={{ top: "2rem", transform: open ? "translateY(6rem) rotate(45deg)" : "none" }}
      />
      <span className={bar} style={{ top: "8rem", opacity: open ? 0 : 1 }} />
      <span
        className={bar}
        style={{ top: "14rem", transform: open ? "translateY(-6rem) rotate(-45deg)" : "none" }}
      />
    </span>
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
