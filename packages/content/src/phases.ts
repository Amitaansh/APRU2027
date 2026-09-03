import type { PhaseId } from "./types";

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
  /**
   * The label already states that the action is not open yet, so the button
   * renders it alone. Without this the unset-URL branch appends its own
   * "— soon" and "Registration open soon" comes out saying soon twice.
   */
  pending?: boolean;
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
      // A placeholder until the registration route exists. With no URL set this
      // renders as a stated status rather than a button that goes nowhere; fill
      // NEXT_PUBLIC_INTEREST_FORM_URL and drop `pending` to make it live.
      label: "Registration open soon",
      url: process.env.NEXT_PUBLIC_INTEREST_FORM_URL ?? "",
      event: "InterestClick",
      pending: true,
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
