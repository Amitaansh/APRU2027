"use client";

import { StatusBlock } from "@/components/ui/ToBeAnnounced";
import { site } from "@/lib/content";
import { track } from "@/lib/analytics";
import { usePhase } from "@/lib/usePhase";

/**
 * The contact route is a mailto, not a form (TRD §9) — still outbound, still no
 * capture.
 *
 * The inbox is content now (site.contactEmail) rather than an environment
 * variable, so the coming-soon branch below is effectively unreachable. It is
 * kept because the address being absent is still a state the page should survive
 * — an emptied content field should degrade, not render "mailto:undefined".
 */
export function ContactRoute() {
  const { phase } = usePhase();
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;

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
