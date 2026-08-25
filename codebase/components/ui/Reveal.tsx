"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Design Brief §06 — scroll reveal: translateY(28px) to 0 plus fade,
 * ease-out-expo, 500-900ms, children staggered 60ms. Transform and opacity
 * only, so it stays on the compositor. MotionConfig in Providers collapses all
 * of it to instant under prefers-reduced-motion.
 */

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  );
}

/**
 * Design Brief §06 — grid / cell reveal: scale(.4) to 1 plus fade,
 * ease-out-quart, 240-300ms, staggered by index (the checkerboard).
 */
const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;

export function CellReveal({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.28,
        delay: Math.min(index * 0.045, 0.5),
        ease: EASE_OUT_QUART,
      }}
    >
      {children}
    </m.div>
  );
}
