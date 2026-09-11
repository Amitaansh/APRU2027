"use client";

import { CTAButton } from "./CTAButton";
import { StatusBlock, ToBeAnnounced } from "./ToBeAnnounced";
import { availableActions } from "@apru/content/phase";
import { phases } from "@apru/content/phases";
import { registration } from "@apru/content";
import { usePhase } from "@apru/content/usePhase";

/**
 * Register is a phase-conditional page (App Flow §7.5).
 *
 * Before 15 Jan 2027 it is honest about not being open and carries NO inline
 * button — the conversion is caught by the footer CTA. From that day it flips to
 * an actionable page with a real registration link. Same build, same file.
 *
 * ASKED OF THE WINDOW, NOT OF THE PHASE. `phase !== "P0"` was the test here, and
 * it was wrong the moment the call for abstracts got a date: the site leaves P0
 * on 15 September 2026, four months before registration opens, and this page
 * would have announced that registration was open for every one of those days.
 */
export function RegisterState() {
  const { today } = usePhase();
  const open =
    availableActions(today).includes("register") && Boolean(phases.cta.register.url);

  /*
   * As on the call for abstracts: "not open" is two facts. `availableActions`
   * drops registration once the conference has ended, and the page would then go
   * back to saying it opens soon -- about an event that has already happened.
   */
  const over = today > phases.milestones.eventEnd;

  if (!open) {
    return over ? (
      <ToBeAnnounced
        label="Registration has closed"
        note="The 10th APRU Sustainable Cities and Landscapes Conference has taken place."
      />
    ) : (
      <ToBeAnnounced label="Registration opens soon" note={registration.body} />
    );
  }

  return (
    <StatusBlock
      live
      status="Now open"
      title="Registration is open"
      note="Registration is handled on the conference registration platform. You will be taken there in a new tab."
    >
      <CTAButton page="register" surface="inline" target={phases.cta.register} />
    </StatusBlock>
  );
}
