"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { CTAButton } from "@/components/ui/CTAButton";
import { pageKeyFor } from "@/lib/routes";
import { useHydrated } from "@/lib/useHydrated";

/**
 * App Flow §2 — the floating conversion surface. Hidden while the hero is in
 * view, revealed once it scrolls out, and shown immediately on pages that have
 * no hero. It exists because the Register page deliberately carries no inline
 * button in P0 (App Flow §7.5), so conversion cannot rest on that page.
 *
 * Home is the only route with a hero, which is known at render — no DOM query
 * is needed to decide the starting state. The observer then tracks the hero
 * itself, so the reveal point is correct at any viewport height.
 */
export function FloatingCTA() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const page = pageKeyFor(pathname);
  const hasHero = page === "home";
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    if (!hasHero) return;
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [hasHero, pathname]);

  const visible = hydrated && (hasHero ? !heroInView : true);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.24, ease: [0.165, 0.84, 0.44, 1] }}
          className="fixed bottom-5 right-5 z-40 print:hidden"
        >
          <CTAButton page={page} surface="floating" />
        </m.div>
      )}
    </AnimatePresence>
  );
}
