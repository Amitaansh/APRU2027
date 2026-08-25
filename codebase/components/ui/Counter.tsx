"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Design Brief §06 — count-up on entry, linear, ~1200ms, one-shot.
 * Reduced motion skips the animation and renders the final value.
 */
export function Counter({
  to,
  label,
  suffix = "",
}: {
  to: number;
  label: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [counted, setCounted] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const duration = 1200;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setCounted(Math.round(progress * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to]);

  const value = reduced ? to : counted;

  return (
    <div ref={ref} className="border-t border-line pt-5">
      <p className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tabular-nums">
        {value}
        {suffix}
      </p>
      <p className="label-mono mt-3">{label}</p>
    </div>
  );
}
