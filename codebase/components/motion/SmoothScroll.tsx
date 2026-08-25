"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis owns the scroll position for the whole site.
 *
 * The lerp and easing are matched to the reference: a long, flat curve with no
 * overshoot, so the page keeps travelling after the wheel stops. Lenis performs
 * a real scroll rather than transforming a wrapper, so `window.scrollY` still
 * reports the smoothed position and anything else that needs it -- the halo, the
 * progress bar -- can read it directly without subscribing here.
 *
 * It is not started at all under prefers-reduced-motion; native scrolling is
 * left completely alone.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      // Touch devices keep their native scrolling; momentum there is the OS's
      // job and hijacking it is what makes smooth-scroll sites feel broken.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors have to go through Lenis or they fight the interpolation.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.("a[href^='#']");
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
