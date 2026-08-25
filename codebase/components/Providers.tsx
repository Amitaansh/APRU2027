"use client";

import { ThemeProvider } from "next-themes";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `LazyMotion` with the `domAnimation` feature set keeps the animation bundle
 * to the subset this site actually uses (transform/opacity, whileInView) rather
 * than shipping all of Motion — the TRD's performance stance still holds.
 *
 * `MotionConfig reducedMotion="user"` is the global guard: every animation
 * below collapses to instant when the visitor asks for reduced motion.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
