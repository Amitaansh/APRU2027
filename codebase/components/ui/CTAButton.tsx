"use client";

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
 *
 * Visually it is a rectangle and a rule: `.btn` inverts on hover over 600ms and
 * takes its border from `currentColor`, so it works on the dark ground with no
 * variant of its own. The arrow is a typographic character, not an icon.
 */

export type Surface = "hero" | "floating" | "footer" | "inline";

export function CTAButton({
  page,
  surface,
  variant = "primary",
  target,
  className = "",
}: {
  page: string;
  surface: Surface;
  variant?: "primary" | "secondary";
  /** Defaults to the phase's primary action; pass to pin a specific one. */
  target?: CTATarget | null;
  className?: string;
}) {
  const { cta, phase } = usePhase();
  const action = target !== undefined ? target : cta.primary;

  // P4 with no proceedings link configured: there is nothing to ask for.
  if (!action) return null;

  const src = page + "-" + surface;
  const base = "btn " + (variant === "primary" ? "btn-fill " : "") + className;

  if (!action.url) {
    // Outline, never the fill: the fill's ink is the ground's own colour, and
    // this state overrides it with .dim, which would leave grey on white.
    return (
      <span
        className={"btn dim cursor-default " + className}
        title="This link will be published shortly"
      >
        {action.label} <span className="dim">— soon</span>
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
      className={base}
    >
      {action.label}
      <span aria-hidden="true">&#8599;</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
