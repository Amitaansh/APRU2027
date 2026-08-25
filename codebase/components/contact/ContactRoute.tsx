"use client";

import { Mail } from "lucide-react";
import { track } from "@/lib/analytics";
import { usePhase } from "@/lib/usePhase";

/**
 * The contact route is a mailto, not a form (TRD §9) — still outbound, still no
 * capture. Until the committee inbox is supplied, this renders the same
 * labelled coming-soon affordance the CTA uses rather than a dead link.
 */
export function ContactRoute() {
  const { phase } = usePhase();
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  if (!email) {
    return (
      <div className="border border-dashed border-line-strong bg-surface p-8">
        <p className="label-mono text-accent">§ TBA</p>
        <p className="mt-3 font-display text-xl font-bold md:text-2xl">
          Committee inbox coming soon
        </p>
        <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted">
          A single address for the organising committee is being set up and will be published here.
          In the meantime, use the interest form linked on any page — it reaches the same team.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-surface p-8">
      <p className="label-mono">Organising committee</p>
      <a
        href={"mailto:" + email}
        onClick={() => track("ContactClick", { src: "contact-inline", phase })}
        className="mt-3 inline-flex items-center gap-3 font-display text-xl font-bold transition-colors duration-[180ms] hover:text-accent md:text-3xl"
      >
        <Mail aria-hidden="true" className="size-5" />
        {email}
      </a>
      <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-muted">
        For enquiries about the program, the working groups, the student symposium, or partnering
        with the conference.
      </p>
    </div>
  );
}
