"use client";

import { m } from "motion/react";
import { CTAButton } from "@/components/ui/CTAButton";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/content";
import { usePhase } from "@/lib/usePhase";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

/**
 * Theme-first hero (PRD §5.1, Design Brief §03/§05). The title is the primary
 * graphic: Archivo Expanded, uppercase, near-zero leading, over the duotone
 * dithered terrain.
 *
 * data-hero is what FloatingCTA observes to decide when to reveal itself.
 */
export function Hero() {
  const { cta } = usePhase();

  return (
    <section data-hero className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="absolute inset-0">
        <picture>
          <source srcSet="/images/hero-1920.avif 1920w, /images/hero-1280.avif 1280w, /images/hero-768.avif 768w" type="image/avif" sizes="100vw" />
          <img
            src="/images/hero-768.webp"
            alt=""
            className="size-full object-cover opacity-90 dark:opacity-70"
            width={1280}
            height={720}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-paper/20" />
      </div>

      <Container className="relative">
        <div className="flex min-h-[78vh] flex-col justify-end py-16 md:min-h-[86vh] md:py-24">
          <m.p
            className="label-mono mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            {site.seriesName} &middot; {site.dates} &middot; {site.location}
          </m.p>

          <m.h1
            className="font-display text-[clamp(2.75rem,12vw,9rem)] font-black"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.06 }}
          >
            Bridging
            <br />
            Resilience<span className="text-accent">(s)</span>
          </m.h1>

          <m.div
            className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.18 }}
          >
            <p className="max-w-[46ch] text-base leading-relaxed text-muted md:text-lg">
              {site.tagline}
            </p>
            <div className="flex flex-wrap gap-3">
              <CTAButton page="home" surface="hero" />
              {cta.secondary && (
                <CTAButton page="home" surface="hero" variant="secondary" target={cta.secondary} />
              )}
            </div>
          </m.div>
        </div>
      </Container>
    </section>
  );
}
