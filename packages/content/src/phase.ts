import {
  phases,
  type CTAKey,
  type CTATarget,
  type PhaseConfig,
  type PhaseMilestones,
} from "./phases";
import type { NavItem, PhaseId } from "./types";

/**
 * The phase engine (App Flow §3, Backend Schema §4.2).
 *
 * resolvePhase is pure and null-safe so it can run identically at build time
 * (for the static baseline) and in the browser on mount. All comparisons are on
 * ISO YYYY-MM-DD strings, which sort lexicographically — no timezone maths and
 * no Date-parsing ambiguity.
 */

const PHASE_ORDER: PhaseId[] = ["P0", "P1", "P2", "P3", "P4"];

/** Local calendar date as ISO YYYY-MM-DD — the visitor's own day, not UTC. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

/**
 * Resolve the current phase.
 *
 * An unset (null) milestone can never trigger its phase, so with every future
 * date null — today's reality — this returns P0 and the site behaves as a plain
 * "notify me" launch. Filling one date in config activates its phase live.
 */
export function resolvePhase(today: string, m: PhaseMilestones): PhaseId {
  if (today > m.eventEnd) return "P4";
  if (m.countdownFrom && today >= m.countdownFrom) return "P3";
  // A null close date leaves the abstract window open-ended until the event.
  if (
    m.abstractsOpen &&
    today >= m.abstractsOpen &&
    (!m.abstractsClose || today < m.abstractsClose)
  ) {
    return "P2";
  }
  if (m.registrationOpens && today >= m.registrationOpens) return "P1";
  return "P0";
}

function phaseRank(p: PhaseId): number {
  return PHASE_ORDER.indexOf(p);
}

/**
 * Which outbound actions are genuinely available on a given day, in
 * overlapPriority order (abstracts > register > notify). Registration and the
 * abstract window can be open at once, so the phase alone does not tell you.
 */
export function availableActions(
  today: string,
  config: PhaseConfig = phases,
): CTAKey[] {
  const m = config.milestones;
  const open: Record<string, boolean> = {
    abstracts: Boolean(
      m.abstractsOpen &&
        today >= m.abstractsOpen &&
        (!m.abstractsClose || today < m.abstractsClose),
    ),
    register: Boolean(
      m.registrationOpens &&
        today >= m.registrationOpens &&
        today <= m.eventEnd,
    ),
    notify: true,
  };
  return config.overlapPriority.filter((key) => open[key]);
}

export interface ResolvedCTAs {
  /** Highest-priority action — the floating button always shows this one. */
  primary: CTATarget | null;
  /** Shown alongside the primary in hero and footer when phases overlap. */
  secondary: CTATarget | null;
}

export function resolveCTAs(
  today: string,
  config: PhaseConfig = phases,
): ResolvedCTAs {
  if (today > config.milestones.eventEnd) {
    return { primary: config.cta.proceedings ?? null, secondary: null };
  }
  const keys = availableActions(today, config);
  const target = (k: CTAKey): CTATarget | null =>
    k === "proceedings" ? (config.cta.proceedings ?? null) : config.cta[k];
  return {
    primary: keys[0] ? target(keys[0]) : null,
    // Only surface a second action when a real overlap exists.
    secondary: keys.length > 1 && keys[1] ? target(keys[1]) : null,
  };
}

/**
 * Primary-navbar membership (App Flow §4.2, Backend Schema §3.2): an item shows
 * when it is a baseline primary item, when the phase has reached its
 * activeFrom, or when content landing has flipped it active. The footer always
 * lists everything, so nothing is ever unreachable.
 */
export function isInPrimaryNav(
  item: NavItem,
  phase: PhaseId,
  derivedActive?: boolean,
): boolean {
  if (item.group === "primary") return true;
  if (derivedActive ?? item.active) return true;
  if (item.activeFrom && phaseRank(phase) >= phaseRank(item.activeFrom)) {
    return true;
  }
  return false;
}

/**
 * Append ?src=<page>-<surface> to an outbound URL (App Flow §6.5). The external
 * form ignores it; it preserves the option of attribution later.
 */
export function withSource(url: string, src: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    u.searchParams.set("src", src);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Build-time baseline. NEXT_PUBLIC_BUILD_DATE is inlined by next.config.ts so
 * the server-rendered HTML and the first client render agree exactly; usePhase
 * then reconciles against the visitor's own clock on mount.
 */
export const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-01-01";
export const BASELINE_PHASE: PhaseId = resolvePhase(
  BUILD_DATE,
  phases.milestones,
);
