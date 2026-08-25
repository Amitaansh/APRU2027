"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Reveals are CSS transitions, not JS animations. The element carries the
 * end-state classes from globals.css (`.ln-mask`, `.rise`); all this does is add
 * `.is-in` once, which releases everything inside it.
 *
 * The class is written straight onto the node rather than held in React state.
 * Reveals fire once and never read back, so state would only buy a re-render of
 * the subtree for no benefit — and setting state from an effect on mount is
 * exactly the cascading-render pattern React warns about.
 *
 * Keeping the animation in CSS also means the stagger is a `transition-delay` at
 * the call site and the reduced-motion escape hatch is a media query rather than
 * a runtime branch.
 */

/**
 * The hero waits for the preloader rather than for fonts: releasing its masks
 * while the loading screen is still up would spend the reveal behind a white
 * panel. Preloader dispatches this once the band is most of the way open.
 */
export const ENTERED = "apru:entered";

function useReveal(immediate = false, gate?: "entered") {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => node.classList.add("is-in");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    /*
     * Gated on the preloader. Two ways to be released without ever hearing the
     * event: the page has already been entered (a client-side navigation back to
     * the home page, where `data-entered` is still on the root from the first
     * load), or there is no loading screen in the document at all.
     */
    if (gate === "entered") {
      if (document.documentElement.dataset.entered || !document.querySelector(".preload")) {
        show();
        return;
      }
      // Belt and braces, exactly as below: if the event never arrives, the hero
      // must still appear.
      const timer = window.setTimeout(show, 4000);
      const onEntered = () => {
        window.clearTimeout(timer);
        show();
      };
      window.addEventListener(ENTERED, onEntered, { once: true });
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener(ENTERED, onEntered);
      };
    }

    // Reveals on load rather than on scroll, but only once the faces have
    // settled — releasing a mask mid-swap shows the fallback face rising.
    if (immediate) {
      // Belt and braces: the timeout releases even if fonts.ready never settles.
      const timer = window.setTimeout(show, 1200);
      document.fonts?.ready.then(show);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, gate]);

  return ref;
}

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  immediate = false,
  gate,
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  immediate?: boolean;
  gate?: "entered";
  style?: CSSProperties;
}) {
  const ref = useReveal(immediate, gate);
  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Display type, one mask per line.
 *
 * Lines are authored, not measured: the copy on this site is short enough to
 * break by hand, and hand-breaking is the only way a mask can be guaranteed to
 * hold exactly one line — which is what the descender arithmetic in
 * `.e-lh .ln-mask` depends on. Anything that wraps belongs in `.rise` instead.
 */
export function MaskLines({
  lines,
  className = "",
  as: Tag = "span",
  stagger = 0.08,
  delay = 0,
  immediate = false,
  gate,
}: {
  lines: ReactNode[];
  className?: string;
  as?: ElementType;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
  gate?: "entered";
}) {
  const ref = useReveal(immediate, gate);
  return (
    <Tag ref={ref as never} className={"e-lh " + className}>
      {lines.map((line, i) => (
        <span key={i} className="ln-mask">
          <span className="ln" style={{ transitionDelay: delay + i * stagger + "s" }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
