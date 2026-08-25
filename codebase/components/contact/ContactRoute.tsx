"use client";

import { StatusBlock } from "@/components/ui/ToBeAnnounced";
import { track } from "@/lib/analytics";
import { usePhase } from "@/lib/usePhase";

/**
 * The contact route is a mailto, not a form (TRD §9) — still outbound, still no
 * capture. Until the committee inbox is supplied, this renders the same labelled
 * coming-soon state the rest of the site uses rather than a dead link.
 */
export function ContactRoute() {
  const { phase } = usePhase();
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  if (!email) {
    return (
      <StatusBlock
        status="To be announced"
        title="Committee inbox coming soon"
        note="A single address for the organising committee is being set up and will be published here. In the meantime, use the interest form linked on any page — it reaches the same team."
      />
    );
  }

  return (
    <StatusBlock
      status="Organising committee"
      title={
        <a
          href={"mailto:" + email}
          onClick={() => track("ContactClick", { src: "contact-inline", phase })}
          className="link"
        >
          {email}
        </a>
      }
      note="For enquiries about the programme, the working groups, the student symposium, or partnering with the conference."
    />
  );
}
