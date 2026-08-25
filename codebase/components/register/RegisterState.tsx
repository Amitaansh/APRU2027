"use client";

import { CTAButton } from "@/components/ui/CTAButton";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { phases } from "@/content/phases";
import { usePhase } from "@/lib/usePhase";

/**
 * Register is a phase-conditional page (App Flow §7.5).
 *
 * In P0 it is honest about not being open and carries NO inline button — the
 * conversion is caught by the floating and footer CTAs. From P1 it flips to an
 * actionable page with a real registration link. Same build, same file.
 */
export function RegisterState() {
  const { phase } = usePhase();
  const open = phase !== "P0" && Boolean(phases.cta.register.url);

  if (!open) {
    return (
      <ToBeAnnounced
        label="Registration opens soon"
        note="Registration for the 10th APRU-SCL conference is not yet open. General and student rates will both be published here once confirmed, along with what each registration includes. Use the link on this page to be notified the day it opens."
      />
    );
  }

  return (
    <div className="border border-line bg-surface p-8">
      <p className="label-mono text-accent">§ Now open</p>
      <p className="mt-3 font-display text-2xl font-bold">Registration is open</p>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted">
        Registration is handled on the conference registration platform. You will be taken there in a new tab.
      </p>
      <div className="mt-8">
        <CTAButton page="register" surface="inline" target={phases.cta.register} />
      </div>
    </div>
  );
}
