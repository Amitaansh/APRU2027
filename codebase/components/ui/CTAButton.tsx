"use client";

import { ArrowUpRight } from "lucide-react";
import type { CTATarget } from "@/content/phases";
import { track } from "@/lib/analytics";
import { withSource } from "@/lib/phase";
import { usePhase } from "@/lib/usePhase";

/**
 * The one conversion component (App Flow §6). Its label and destination come
 * from the resolved phase, so "Register your interest" becomes "Register now"
 * and then "Submit an abstract" with no code change — only a config date.
 *
 * Three rules it must never break:
 *  - outbound only, new tab, rel=noopener — nothing posts to our own server;
 *  - an unset URL renders a labelled "link coming soon" affordance, never a
 *    dead href that looks broken (App Flow §7.9);
 *  - every click is tagged src=<page>-<surface> for attribution later.
 */

export type Surface = "hero" | "floating" | "footer" | "inline";

const BASE =
  "group inline-flex items-center gap-3 border px-6 py-3.5 font-medium tracking-tight transition-[transform,background-color,color] duration-[180ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]";

const VARIANTS = {
  primary:
    "border-ink bg-orange text-[#0c0c0d] hover:-translate-y-[3px] hover:bg-orange/90",
  secondary:
    "border-line-strong bg-transparent text-ink hover:-translate-y-[3px] hover:border-ink",
} as const;

export function CTAButton({
  page,
  surface,
  variant = "primary",
  target,
  className = "",
}: {
  page: string;
  surface: Surface;
  variant?: keyof typeof VARIANTS;
  /** Defaults to the phase's primary action; pass to pin a specific one. */
  target?: CTATarget | null;
  className?: string;
}) {
  const { cta, phase } = usePhase();
  const action = target !== undefined ? target : cta.primary;

  // P4 with no proceedings link configured: there is nothing to ask for.
  if (!action) return null;

  const src = page + "-" + surface;

  if (!action.url) {
    return (
      <span
        className={BASE + " cursor-default border-dashed border-line-strong bg-surface text-muted " + className}
        title="This link will be published shortly"
      >
        {action.label}
        <span className="label-mono normal-case tracking-normal">link coming soon</span>
      </span>
    );
  }

  return (
    <a
      href={withSource(action.url, src)}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics={action.event}
      onClick={() => track(action.event, { src, phase })}
      className={BASE + " " + VARIANTS[variant] + " " + className}
    >
      {action.label}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
