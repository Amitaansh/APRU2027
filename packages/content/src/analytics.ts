import type { PhaseId } from "./types";

/**
 * Plausible custom goals (Backend Schema §6). No cookies, no identity, no
 * funnels — pageviews are automatic and these four goals are the only events.
 *
 * If no Plausible domain is configured the script is never loaded and this is a
 * silent no-op, so a missing analytics account cannot block go-live.
 */

export type Goal =
  | "InterestClick"
  | "RegisterClick"
  | "AbstractClick"
  | "ContactClick";

type Plausible = (
  goal: string,
  options?: { props?: Record<string, string> },
) => void;

declare global {
  interface Window {
    plausible?: Plausible;
  }
}

export function track(goal: Goal, props: { src: string; phase: PhaseId }): void {
  if (typeof window === "undefined") return;
  window.plausible?.(goal, { props });
}
