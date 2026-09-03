"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A belt of marks that drifts sideways on its own and answers to the scroll.
 *
 * Children are repeated sets of the same content, laid end to end. The track is
 * translated leftward and wrapped at ONE set's width, so the instant the first
 * set has left the frame the second is standing exactly where it started and
 * the reset cannot be seen. Everything the caller has to get right is therefore
 * a matter of arithmetic rather than of timing: render enough sets that the
 * track is at least one set wider than the viewport, or a gap opens at the
 * right edge on the widest screens. See SETS in components/home/Sponsors.tsx.
 *
 * WHY A rAF LOOP AND NOT @keyframes. The reduced-motion kill switch in
 * globals.css forces `animation-duration: 0.01ms !important` on everything,
 * which does not stop a keyframed marquee -- it fast-forwards it to its end
 * state and leaves the strip parked at the wrong offset. A JS loop that checks
 * the media query and never starts is both the house convention (Reveal,
 * Curtain, Cursor, Preloader and Halo all do exactly this) and the only version
 * that degrades to the thing a reader asked for, which is stillness.
 *
 * The transform is written straight to the node rather than held in React
 * state, like every other per-frame value on the site.
 */

/** Seconds for one set to travel its own width, with the page held still. */
const CYCLE = 15;

/** What a scroll of 1px per 60fps frame is worth, as a share of the base speed. */
const GAIN = 0.06;

/*
 * The floor is the whole of the scroll-up behaviour: velocity going negative
 * bleeds the drift down to a crawl and stops there, so the marks never reverse
 * and the belt keeps one reading direction whatever the page is doing. The
 * ceiling stops a flung trackpad from smearing them into stripes.
 */
const MIN = 0.08;
const MAX = 4;

export function Belt({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    // Still, and collapsed to a single centred set by the CSS.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.static = "";
      return;
    }

    const set = track.firstElementChild as HTMLElement | null;
    if (!set) return;

    let width = set.getBoundingClientRect().width;
    let coupled = window.innerWidth >= 768;

    /*
     * Measured, never assumed. Every length on the site is fluid, so the set is
     * a different width at 1366 than at 1920, and it changes again when the
     * marks decode and the boxes take their real height. Observing the set
     * covers all of it without a resize listener.
     */
    const observer = new ResizeObserver(() => {
      width = set.getBoundingClientRect().width;
      // Touch scrolling is the OS's job -- see SmoothScroll.tsx -- and its
      // velocity is far too coarse to drive this, so phones get the drift only.
      coupled = window.innerWidth >= 768;
    });
    observer.observe(set);

    /*
     * The marks are links, and a link you have to chase is not one -- so the
     * belt stops under the pointer, and stops again when focus lands anywhere
     * inside it, which is the same courtesy for a reader arriving by keyboard.
     *
     * Pointer type is checked because a tap fires pointerenter and would leave
     * the belt parked until the reader happened to touch something else.
     */
    let paused = false;
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") paused = true;
    };
    const onLeave = () => {
      paused = false;
    };
    const onFocusIn = () => {
      paused = true;
    };
    const onFocusOut = () => {
      paused = false;
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);

    let offset = 0;
    let last = 0;
    let lastY = window.scrollY;
    let speed = 0; // smoothed scroll velocity, px per 60fps frame
    let held = 0; // eased hover, 0 running -> 1 frozen
    let frame = 0;

    const tick = (now: number) => {
      // Capped, so a tab left in the background does not come back to a belt
      // that has jumped half a set in one step.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      /*
       * Lenis performs a real scroll rather than transforming a wrapper, so
       * scrollY already reports the smoothed position and there is nothing to
       * subscribe to -- see SmoothScroll.tsx, and Halo.tsx which reads it the
       * same way. Normalised against dt so the boost is the same size on a
       * 120Hz display as on a 60Hz one.
       */
      const y = window.scrollY;
      const raw = coupled && dt > 0 ? (y - lastY) / (dt * 60) : 0;
      lastY = y;
      speed += (raw - speed) * 0.1;

      held += ((paused ? 1 : 0) - held) * 0.12;

      const factor = Math.min(Math.max(1 + speed * GAIN, MIN), MAX) * (1 - held);

      if (width > 0) {
        offset = (offset - (width / CYCLE) * factor * dt) % width;
        track.style.transform = "translate3d(" + offset + "px,0,0)";
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div ref={rootRef} className={"belt " + className}>
      <div ref={trackRef} className="belt-track">
        {children}
      </div>
    </div>
  );
}
