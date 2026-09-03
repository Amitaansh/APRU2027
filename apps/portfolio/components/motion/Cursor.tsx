"use client";

import { useEffect, useRef } from "react";

/**
 * The pointer, as the APRU mark.
 *
 * A solid orange dot tracks the pointer exactly; the halo ring lerps after it and
 * turns slowly on its own clock, so the mark reads as the same object that rides
 * the page in Halo.tsx rather than as a generic cursor ring.
 *
 * WHY THE FLAT ICON RATHER THAN THE TORUS. Halo.tsx renders a lit torus from a
 * polar unwrap of /icon.png -- a 2048x128 resample and a WebGL context. At 40px,
 * turning on one axis, none of that survives being looked at, and a second
 * context would buy nothing. This draws the same artwork, flat, and the file is
 * already warm in cache because the halo fetched it.
 *
 * WHY THREE NESTED ELEMENTS PER LIMB. JavaScript owns translate and rotate,
 * which are per-frame and time-based; CSS owns scale, which is state-based and
 * wants the site's easing curve. Composing all three in one JS-written transform
 * would mean re-implementing easing in JS, or registering an @property so a
 * custom property could interpolate. Nesting is cheaper and cannot desync.
 */

/** How far the ring closes on the pointer each frame. */
const LERP = 0.14;
/** One turn, in milliseconds. */
const SPIN = 12000;

const INTERACTIVE =
  "a[href], button, [role='button'], summary, input, select, textarea, label, .idx-row";

export function Cursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const spin = spinRef.current;
    const dot = dotRef.current;
    if (!root || !ring || !spin || !dot) return;

    /*
     * Only where there is a cursor to replace. On touch there is no pointer to
     * stand in for, and under reduced motion a lerping element that trails the
     * hand is exactly the kind of movement being opted out of -- so in both cases
     * the native cursor is left completely alone, as SmoothScroll and Halo do.
     */
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    /*
     * The gate is a class on the node, not React state -- the same reason Reveal
     * gives for writing `.is-in` directly. It matters more than usual here: the
     * mark is `display: none` until this line runs, and a browser does not fetch
     * the background image of an element it is not rendering, so a phone never
     * pays for a ring it will never draw.
     */
    root.dataset.live = "1";

    const html = document.documentElement;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let seen = false;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      root.dataset.on = "1";
      if (seen) return;
      seen = true;
      // Jump the ring to the first known position rather than flying it in from
      // the middle of the screen.
      rx = x;
      ry = y;
      // The native cursor is only given up once the replacement is on screen.
      html.dataset.cursor = "on";
    };

    const tick = (now: number) => {
      rx += (x - rx) * LERP;
      ry += (y - ry) * LERP;
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      spin.style.transform = "rotate(" + (((now / SPIN) * 360) % 360) + "deg)";
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    /*
     * `pointerover` alone, resolved from the target every time, rather than an
     * over/out pair: moving between an element and its own children fires over
     * on the ancestor, which still matches, so the state cannot flicker the way
     * a paired handler does.
     */
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.(INTERACTIVE)) root.dataset.hot = "1";
      else delete root.dataset.hot;
    };
    // relatedTarget is null only when the pointer has left the window entirely.
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) delete root.dataset.on;
    };
    const onDown = () => (root.dataset.down = "1");
    const onUp = () => delete root.dataset.down;

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      delete html.dataset.cursor;
      delete root.dataset.live;
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="cur">
      <div ref={ringRef} className="cur-pos">
        <div ref={spinRef} className="cur-spin">
          <div className="cur-ring" />
        </div>
      </div>
      <div ref={dotRef} className="cur-pos">
        <span className="cur-dot" />
      </div>
    </div>
  );
}
