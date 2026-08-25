"use client";

import type { ReactNode } from "react";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * There is no theme provider any more: the site is one ground, and sections
 * that go dark paint themselves (see `[data-ground="dark"]` in globals.css).
 *
 * Reveals are CSS transitions released by an IntersectionObserver rather than
 * Motion components, so nothing here needs a motion runtime.
 *
 * Cursor mounts here beside SmoothScroll because both are document-wide pointer
 * and scroll concerns with no markup of their own to place; each decides for
 * itself whether the visitor's device and motion preference want it at all.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      {children}
    </>
  );
}
