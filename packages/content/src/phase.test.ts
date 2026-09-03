import { describe, expect, it } from "vitest";
import {
  availableActions,
  isInPrimaryNav,
  resolveCTAs,
  resolvePhase,
  todayISO,
  withSource,
} from "./phase";
import type { PhaseConfig, PhaseMilestones } from "./phases";
import type { NavItem } from "./types";

const EVENT = { eventStart: "2027-05-21", eventEnd: "2027-05-23" };

const allNull: PhaseMilestones = {
  registrationOpens: null,
  abstractsOpen: null,
  abstractsClose: null,
  countdownFrom: null,
  ...EVENT,
};

describe("resolvePhase — the shipping case", () => {
  it("returns P0 with every future milestone null, on any day before the event ends", () => {
    for (const day of ["2026-08-31", "2026-12-25", "2027-05-20", "2027-05-23"]) {
      expect(resolvePhase(day, allNull)).toBe("P0");
    }
  });

  it("still reaches P4 after the event even with every other milestone null", () => {
    expect(resolvePhase("2027-05-24", allNull)).toBe("P4");
  });
});

describe("resolvePhase — boundaries", () => {
  const m: PhaseMilestones = {
    registrationOpens: "2026-11-01",
    abstractsOpen: "2027-01-15",
    abstractsClose: "2027-03-01",
    countdownFrom: "2027-05-01",
    ...EVENT,
  };

  it("is P0 the day before registration opens", () => {
    expect(resolvePhase("2026-10-31", m)).toBe("P0");
  });

  it("flips to P1 on the day registration opens", () => {
    expect(resolvePhase("2026-11-01", m)).toBe("P1");
  });

  it("flips to P2 on the day abstracts open and holds to the day before close", () => {
    expect(resolvePhase("2027-01-14", m)).toBe("P1");
    expect(resolvePhase("2027-01-15", m)).toBe("P2");
    expect(resolvePhase("2027-02-28", m)).toBe("P2");
  });

  it("falls back to P1 on the abstract close date", () => {
    expect(resolvePhase("2027-03-01", m)).toBe("P1");
  });

  it("flips to P3 on the countdown date and holds through the final event day", () => {
    expect(resolvePhase("2027-04-30", m)).toBe("P1");
    expect(resolvePhase("2027-05-01", m)).toBe("P3");
    expect(resolvePhase("2027-05-23", m)).toBe("P3");
  });

  it("flips to P4 the day after the event ends", () => {
    expect(resolvePhase("2027-05-24", m)).toBe("P4");
  });

  it("treats a null close date as an open-ended abstract window", () => {
    const openEnded = { ...m, abstractsClose: null, countdownFrom: null };
    expect(resolvePhase("2027-04-01", openEnded)).toBe("P2");
  });

  it("never activates a phase whose own date is unset", () => {
    expect(resolvePhase("2027-05-01", { ...m, countdownFrom: null })).toBe("P1");
  });
});

const config: PhaseConfig = {
  milestones: {
    registrationOpens: "2026-11-01",
    abstractsOpen: "2027-01-15",
    abstractsClose: "2027-03-01",
    countdownFrom: null,
    ...EVENT,
  },
  cta: {
    notify: {
      label: "Register your interest",
      url: "https://example.org/notify",
      event: "InterestClick",
    },
    register: {
      label: "Register now",
      url: "https://example.org/register",
      event: "RegisterClick",
    },
    abstracts: {
      label: "Submit an abstract",
      url: "https://uvents.example/abstracts",
      event: "AbstractClick",
    },
  },
  overlapPriority: ["abstracts", "register", "notify"],
};

describe("CTA resolution", () => {
  it("offers notify alone before anything opens", () => {
    expect(availableActions("2026-09-01", config)).toEqual(["notify"]);
    const { primary, secondary } = resolveCTAs("2026-09-01", config);
    expect(primary?.label).toBe("Register your interest");
    expect(secondary).toBeNull();
  });

  it("promotes register above notify once registration is open", () => {
    const { primary, secondary } = resolveCTAs("2026-12-01", config);
    expect(primary?.label).toBe("Register now");
    expect(secondary?.label).toBe("Register your interest");
  });

  it("puts abstracts first during an overlap and register second", () => {
    expect(availableActions("2027-02-01", config)).toEqual([
      "abstracts",
      "register",
      "notify",
    ]);
    const { primary, secondary } = resolveCTAs("2027-02-01", config);
    expect(primary?.label).toBe("Submit an abstract");
    expect(secondary?.label).toBe("Register now");
  });

  it("has no primary action after the event when no proceedings link is set", () => {
    expect(resolveCTAs("2027-06-01", config).primary).toBeNull();
  });
});

describe("primary navbar membership", () => {
  const register: NavItem = {
    label: "Register",
    route: "/register",
    group: "footer-only",
    activeFrom: "P1",
  };
  const home: NavItem = { label: "Home", route: "/", group: "primary" };
  const program: NavItem = {
    label: "Program",
    route: "/program",
    group: "footer-only",
    active: false,
  };

  it("always shows baseline primary items", () => {
    expect(isInPrimaryNav(home, "P0")).toBe(true);
  });

  it("hides Register in P0 and promotes it from P1 onward", () => {
    expect(isInPrimaryNav(register, "P0")).toBe(false);
    expect(isInPrimaryNav(register, "P1")).toBe(true);
    expect(isInPrimaryNav(register, "P3")).toBe(true);
  });

  it("promotes a content-gated page when content lands, regardless of phase", () => {
    expect(isInPrimaryNav(program, "P0")).toBe(false);
    expect(isInPrimaryNav(program, "P0", true)).toBe(true);
  });
});

describe("outbound helpers", () => {
  it("tags the source without dropping existing query params", () => {
    expect(withSource("https://example.org/f?a=1", "cfa-floating")).toBe(
      "https://example.org/f?a=1&src=cfa-floating",
    );
  });

  it("returns empty for an unset URL so callers render the coming-soon affordance", () => {
    expect(withSource("", "home-hero")).toBe("");
  });

  it("formats the local calendar date, not UTC", () => {
    expect(todayISO(new Date(2027, 0, 5, 23, 30))).toBe("2027-01-05");
  });
});
