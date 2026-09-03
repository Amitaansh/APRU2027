"use client";

import { phases } from "./phases";
import {
  BASELINE_PHASE,
  BUILD_DATE,
  resolveCTAs,
  resolvePhase,
  todayISO,
  type ResolvedCTAs,
} from "./phase";
import { useHydrated } from "./useHydrated";
import type { PhaseId } from "./types";

export interface PhaseState {
  phase: PhaseId;
  cta: ResolvedCTAs;
  /** Today as the visitor's browser sees it — the build date until hydration. */
  today: string;
  /** False during the first paint and for no-JS visitors. */
  resolved: boolean;
}

/**
 * The site is statically exported, so the phase is resolved in the browser: a
 * visitor on 1 Feb 2027 sees a different state from the same build as one on
 * 1 June 2027 (App Flow §3.1).
 *
 * The pre-hydration baseline is the phase as of the build date, not a blanket
 * P0. It is correct the day the site deploys, so the HTML a crawler reads and
 * the CTA a no-JS visitor gets are right, and hydration only changes anything
 * once a milestone has passed since the last deploy.
 */
export function usePhase(): PhaseState {
  const hydrated = useHydrated();
  const today = hydrated ? todayISO() : BUILD_DATE;
  const phase = hydrated ? resolvePhase(today, phases.milestones) : BASELINE_PHASE;

  return {
    phase,
    today,
    resolved: hydrated,
    cta: resolveCTAs(today),
  };
}
