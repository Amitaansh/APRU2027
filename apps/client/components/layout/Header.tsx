"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav } from "@apru/content";
import { isInPrimaryNav } from "@apru/content/phase";
import type { NavItem } from "@apru/content/types";
import { usePhase } from "@apru/content/usePhase";

/**
 * A solid bar with a hairline under it. Black on white, everywhere, always.
 *
 * WHAT THIS IS NOT. The portfolio edition's header floats over the artwork with
 * `mix-blend-mode: difference`, which inverts it against whatever sits behind,
 * so one header works over the hero, over white and over black. That is exactly
 * the kind of thing the client asked us to stop doing — and it is also why that
 * header cannot contain its own dropdown: a blend takes its children with it,
 * so an opaque panel inside it renders as a rectangle of inverted page, and the
 * panel has to be a sibling positioned against a measured rect.
 *
 * With no blend, none of that applies. The panel is a normal absolutely
 * positioned child of its list item, and the whole measure-and-reposition
 * mechanism goes away with it.
 *
 * The nav is upper-cased in CSS, not in nav.json, so the labels stay one shared
 * piece of content that each edition sets in its own voice.
 */
export function Header() {
  const pathname = usePathname();
  const { phase } = usePhase();
  // Scoped to the route it was opened on, so navigating closes it without an
  // effect reaching back into state.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const [menu, setMenu] = useState<{ label: string; path: string } | null>(null);
  const down = menu?.path === pathname ? menu : null;
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expanded, setExpanded] = useState<{ path: string; labels: string[] }>({
    path: "",
    labels: [],
  });
  const openLabels = expanded.path === pathname ? expanded.labels : [];

  const items = nav.filter((item) => isInPrimaryNav(item, phase));

  const isCurrent = (route?: string) => {
    if (!route) return false;
    const here =
      pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    return here === route;
  };

  const isWithin = (item: NavItem) =>
    isCurrent(item.route) || Boolean(item.children?.some((child) => isCurrent(child.route)));

  const cancelClose = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    leaveTimer.current = setTimeout(() => setMenu(null), 140);
  }, [cancelClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => cancelClose, [cancelClose]);

  return (
    <header className="fixed left-0 top-0 z-[60] w-full border-b border-bk/10 bg-wh text-bk">
      <div className="ctr flex w-full items-center justify-between py-[16rem] max-md:py-[12rem]">
        {/*
         * The wordmark is the way home: the client's sitemap drops the Home
         * item and asks for the logo to carry it instead.
         */}
        <Link
          href="/"
          aria-label="APRU Sustainable Cities and Landscapes, home"
          className="block leading-[1.2] [font-weight:700]"
        >
          <span className="block text-[17rem] tracking-[-0.02em] max-md:text-[14rem]">APRU</span>
          <span className="block text-[12rem] [font-weight:400] max-md:text-[10rem]">
            Sustainable Cities &amp; Landscapes
          </span>
        </Link>

        <nav aria-label="Primary" className="max-md:hidden">
          <ul className="t-b2 flex items-center gap-[26rem] uppercase tracking-[0.04em]">
            {items.map((item) => {
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
                    </Link>
                  </li>
                );
              }

              const isDown = down?.label === item.label;

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setMenu({ label: item.label, path: pathname });
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {/*
                   * Both parents in this sitemap are buttons rather than links,
                   * because the client removed the Highlight and Programme
                   * landing pages: there is nowhere for the parent itself to go.
                   */}
                  <button
                    type="button"
                    aria-expanded={isDown}
                    aria-haspopup="true"
                    aria-current={isWithin(item) ? "page" : undefined}
                    className="link uppercase"
                    onFocus={() => setMenu({ label: item.label, path: pathname })}
                    onClick={() =>
                      isDown ? setMenu(null) : setMenu({ label: item.label, path: pathname })
                    }
                  >
                    {item.label}
                    <span aria-hidden="true">&#8202;&#9662;</span>
                  </button>

                  {isDown && (
                    <ul className="absolute left-0 top-full flex flex-col gap-[12rem] border border-bk/10 bg-wh px-[20rem] py-[18rem]">
                      {item.children.map((child) => (
                        <li key={child.route}>
                          <Link
                            href={child.route ?? "/"}
                            aria-current={isCurrent(child.route) ? "page" : undefined}
                            className="link whitespace-nowrap"
                            onClick={() => setMenu(null)}
                            onBlur={scheduleClose}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
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
          className="relative hidden h-[16rem] w-[24rem] max-md:block"
        >
          <Hamburger open={open} />
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[var(--hdr)] overflow-y-auto bg-wh px-[15rem] pb-[20rem] pt-[24rem] text-bk md:hidden"
        >
          <nav aria-label="Primary" className="flex flex-col gap-[14rem] uppercase">
            {items.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.route ?? "/"}
                    aria-current={isCurrent(item.route) ? "page" : undefined}
                    onClick={() => setOpenPath(null)}
                    className="t-h4"
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
                        labels: isOpen
                          ? openLabels.filter((label) => label !== item.label)
                          : [...openLabels, item.label],
                      })
                    }
                    className="t-h4 flex w-full items-baseline gap-[10rem] text-left uppercase"
                  >
                    {item.label}
                    <span aria-hidden="true" className="t-b2">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-[10rem] pl-[16rem] pt-[12rem]">
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
          </nav>
        </div>
      )}
    </header>
  );
}

/** Three rules that fold into a cross, drawn in `currentColor`. */
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
