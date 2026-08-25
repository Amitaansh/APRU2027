"use client";

import { CTAButton } from "@/components/ui/CTAButton";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { phases } from "@/content/phases";
import { usePhase } from "@/lib/usePhase";

/**
 * Call for Abstracts is phase-conditional (App Flow §7.6): "opening soon" in
 * P0, flipping to a live submission link once the abstract window opens.
 */
export function AbstractsState() {
  const { phase } = usePhase();
  const open = phase === "P2" && Boolean(phases.cta.abstracts.url);

  if (!open) {
    return (
      <ToBeAnnounced
        label="The call for abstracts is opening soon"
        note="Submissions of papers, posters, and panels will open ahead of the conference. Abstracts are 200 words. Register your interest to be notified the day the call opens — it is the same single form used for every announcement."
      />
    );
  }

  return (
    <div className="border border-line bg-surface p-8">
      <p className="label-mono text-accent">§ Now open</p>
      <p className="mt-3 font-display text-2xl font-bold">Submissions are open</p>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted">
        Abstracts are submitted through the conference submission platform. You will be taken there in a new tab.
      </p>
      <div className="mt-8">
        <CTAButton page="cfa" surface="inline" target={phases.cta.abstracts} />
      </div>
    </div>
  );
}
