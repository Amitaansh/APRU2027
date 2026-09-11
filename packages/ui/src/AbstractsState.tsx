"use client";

import { CTAButton } from "./CTAButton";
import { StatusBlock, ToBeAnnounced } from "./ToBeAnnounced";
import { availableActions } from "@apru/content/phase";
import { phases } from "@apru/content/phases";
import { usePhase } from "@apru/content/usePhase";

/**
 * Call for Abstracts is phase-conditional (App Flow §7.6): "opening soon" before
 * 15 Sep 2026, flipping to a live submission link once the window opens and back
 * again when it closes on 15 Nov.
 *
 * ASKED OF THE WINDOW, NOT OF THE PHASE. This used to test `phase === "P2"`,
 * which was the same question while the site had one window open at a time. It
 * is not any more: a countdown would resolve to P3 with the call still open, and
 * the phase would say closed. `availableActions` is the function that knows which
 * windows are actually open on a given day, and it is already what the CTAs read.
 */
export function AbstractsState() {
  const { today } = usePhase();
  const open =
    availableActions(today).includes("abstracts") && Boolean(phases.cta.abstracts.url);

  /*
   * "Not open" is two different facts, and saying the wrong one is worse than
   * saying nothing. Before 15 September the call is coming; after 15 November it
   * is over, and a page still promising it is "opening soon" six months later is
   * simply untrue. The close date is the boundary between them.
   */
  const closed = Boolean(
    phases.milestones.abstractsClose && today >= phases.milestones.abstractsClose,
  );

  if (!open) {
    return closed ? (
      <ToBeAnnounced
        label="The call for abstracts has closed"
        note="Submissions closed on 15 November 2026. Authors are notified of the outcome on 15 January 2027."
      />
    ) : (
      <ToBeAnnounced
        label="The call for abstracts is opening soon"
        note="Submissions open on 15 September 2026 and close on 15 November 2026. The submission rules are set out below."
      />
    );
  }

  return (
    <StatusBlock
      live
      status="Now open"
      title="Submissions are open"
      note="Abstracts are submitted through the conference submission platform. You will be taken there in a new tab."
    >
      <CTAButton page="cfa" surface="inline" target={phases.cta.abstracts} />
    </StatusBlock>
  );
}
