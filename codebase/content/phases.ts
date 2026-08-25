import type { PhaseId } from "@/lib/types";

/**
 * The date-aware phase engine's configuration (Backend Schema §4).
 *
 * Config, not code: editing the milestone values below changes live behaviour
 * without touching logic. Every future milestone is null today, so the site
 * resolves to P0 — a clean "Notify me" launch (App Flow §3.3).
 */

export interface CTATarget {
  label: string;
  /** External destination. Empty string → "link coming soon" affordance. */
  url: string;
  /** Plausible goal name. */
  event: "InterestClick" | "RegisterClick" | "AbstractClick" | "ContactClick";
}

export interface PhaseMilestones {
  registrationOpens: string | null;
  abstractsOpen: string | null;
  abstractsClose: string | null;
  countdownFrom: string | null;
  eventStart: string;
  eventEnd: string;
}

export type CTAKey = "notify" | "register" | "abstracts" | "proceedings";

export interface PhaseConfig {
  milestones: PhaseMilestones;
  cta: {
    notify: CTATarget;
    register: CTATarget;
    abstracts: CTATarget;
    proceedings?: CTATarget;
  };
  overlapPriority: Exclude<CTAKey, "proceedings">[];
}

export const phases: PhaseConfig = {
  milestones: {
    registrationOpens: null, // [OPEN] fill to activate P1
    abstractsOpen: null, // [OPEN] fill to activate P2
    abstractsClose: null, // [OPEN]
    countdownFrom: null, // [OPEN] fill to activate P3
    eventStart: "2027-05-21",
    eventEnd: "2027-05-23",
  },
  cta: {
    notify: {
      label: "Register your interest",
      url: process.env.NEXT_PUBLIC_INTEREST_FORM_URL ?? "",
      event: "InterestClick",
    },
    register: {
      label: "Register now",
      url: process.env.NEXT_PUBLIC_REGISTRATION_URL ?? "",
      event: "RegisterClick",
    },
    abstracts: {
      label: "Submit an abstract",
      url: process.env.NEXT_PUBLIC_UVENTS_URL ?? "",
      event: "AbstractClick",
    },
  },
  overlapPriority: ["abstracts", "register", "notify"],
};

/** Human-readable phase names, for dev tooling and aria descriptions. */
export const phaseNames: Record<PhaseId, string> = {
  P0: "Notify",
  P1: "Register",
  P2: "Abstracts",
  P3: "Countdown",
  P4: "Post-event",
};
