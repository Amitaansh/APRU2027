"use client";

import { useEffect, useRef, useState } from "react";
import { ENTERED } from "@apru/ui";
import { site } from "@apru/content";

/**
 * The loading screen, and the first half of the hero's arrival.
 *
 * It is two white panels meeting at the centre line, so at rest the screen is
 * simply the paper ground with a count in the corner. At 100 they retract to the
 * top and bottom edges — and what they uncover is the hero, clipped to a band at
 * that same centre line, opening to full bleed behind them. The loader does not
 * get out of the way of the hero; it becomes the hero's opening move.
 *
 * The panels clear in 0.75s while the band takes 1.15s. That gap is the whole
 * point: retract them at the same rate and you see a plain split-open reveal,
 * with no band ever visible.
 *
 * THE MARKUP IS SERVER-RENDERED at full coverage. Under `output: "export"` the
 * home page is static HTML, and the overlay has to be painted on the very first
 * frame or there is a flash of an unloaded page before hydration. JavaScript
 * only drives the count and the exit.
 */

const MIN_MS = 1400;
const PANEL_MS = 750;
const TEXT_MS = 950;

/** Set once the loader has run, so it cannot replay within the same document. */
let played = false;

/**
 * Whether this mount is the initial render of a freshly loaded home page.
 *
 * `PerformanceNavigationTiming.name` is the URL the *document* was fetched with
 * and does not move when Next swaps routes on the client, which is exactly the
 * distinction wanted here: reloading `/` replays the loader, arriving at `/` from
 * a link on another page does not. Reading `location` instead would be wrong --
 * the URL has already been rewritten by the time this module evaluates.
 */
function shouldPlay() {
  if (typeof window === "undefined") return true;
  if (played) return false;
  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  // No Navigation Timing: treat it as a fresh load rather than silently skipping.
  if (!entry?.name) return true;
  try {
    const path = new URL(entry.name).pathname.replace(/\/+$/, "");
    return path === "";
  } catch {
    return true;
  }
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  // Captured once, at this instance's first render, so the decision is stable
  // across re-renders and identical between the server and the first hydration.
  const [active] = useState(shouldPlay);

  useEffect(() => {
    played = true;
    const html = document.documentElement;

    /** Opens the hero band. Set on the root so it survives client-side routing. */
    const open = () => {
      html.dataset.entered = "1";
    };
    /** Releases the hero's masked lines. */
    const release = () => window.dispatchEvent(new Event(ENTERED));

    const root = rootRef.current;
    const numeral = numberRef.current;

    /*
     * Not playing -- an arrival by client-side routing. The hero is clipped shut
     * and its lines are masked until something says otherwise, so opening it is
     * this effect's job whether or not there is a loading screen to lift.
     */
    if (!root || !numeral) {
      open();
      release();
      return;
    }

    // Reduced motion: no count, no wipe. The page is simply already open.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.hidden = true;
      open();
      release();
      return;
    }

    // The same lever Header uses for the mobile menu (see Header.tsx), so Lenis
    // and native scrolling are both held by one class.
    html.classList.add("lenis-stopped");
    window.scrollTo(0, 0);

    /*
     * Two real signals, and the count is not allowed past either of them.
     * `decode()` rather than `load` because a decoded image is the thing that
     * actually matters here -- the artwork must be painted, not merely fetched,
     * before the panels split.
     */
    const TOTAL = 2;
    let loaded = 0;
    let stepAt = performance.now();
    const step = () => {
      loaded += 1;
      stepAt = performance.now();
    };

    if (document.fonts) document.fonts.ready.then(step, step);
    else step();

    const art = document.querySelector<HTMLImageElement>("[data-hero] img");
    if (art) art.decode().then(step, step);
    else step();

    let shown = 0;
    let frame = 0;
    const timers: number[] = [];
    const start = performance.now();

    // If a signal never settles the count would creep and stop. Release it.
    timers.push(window.setTimeout(() => (loaded = TOTAL), 8000));

    const exit = () => {
      root.dataset.open = "1";
      open();
      timers.push(
        window.setTimeout(() => {
          root.hidden = true;
          html.classList.remove("lenis-stopped");
        }, PANEL_MS),
        // The masks are released as the band finishes opening, not as it starts.
        window.setTimeout(release, TEXT_MS),
      );
    };

    const tick = (now: number) => {
      /*
       * The ceiling is what has genuinely loaded, plus a decaying creep toward
       * the next step so the number never sits dead on a value while something
       * is outstanding. The floor is time, which is what stops a warm cache
       * flashing 0 to 100 in two frames.
       */
      const creep = 1 - Math.exp(-(now - stepAt) / 1100);
      const ceiling = Math.min(1, (loaded + creep * 0.75) / TOTAL);
      const target = Math.min(ceiling, (now - start) / MIN_MS);

      shown += (target - shown) * 0.12;
      if (target >= 1 && 1 - shown < 0.004) shown = 1;
      numeral.textContent = String(Math.round(shown * 100));

      if (shown >= 1) {
        exit();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      for (const timer of timers) window.clearTimeout(timer);
      html.classList.remove("lenis-stopped");
    };
  }, []);

  if (!active) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="preload">
      <div className="pre-half pre-half--t" />
      <div className="pre-half pre-half--b">
        <div className="ctr flex w-full items-end justify-between gap-[20rem]">
          <p className="t-lbl dim">{site.seriesName}</p>
          <span ref={numberRef} className="t-h1 tnum leading-[0.75]">
            0
          </span>
        </div>
      </div>
    </div>
  );
}
