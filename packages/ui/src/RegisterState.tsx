"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CTAButton } from "./CTAButton";
import { Reveal } from "./Reveal";
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
 * on 30 September 2026, three and a half months before registration opens, and this page
 * would have announced that registration was open for every one of those days.
 */
/*
 * `variant="statement"` is the client edition's page, set as the client's
 * email (2 Oct 2026) sets it: who has to register, with the four things it
 * names linked to their pages; a line introducing the fees; the fee table
 * "with thin grey lines -- 0.25pt" and its footnote; then the sentence saying
 * when the portal arrives, its date in bold. Everything above that sentence
 * stays whatever state the window is in; only the sentence changes. "status"
 * is the portfolio's, unchanged.
 */
export function RegisterState({
  variant = "status",
}: { variant?: "status" | "statement" } = {}) {
  const state = <RegisterWindow variant={variant} />;
  if (variant === "status") return state;

  const { fees } = registration;
  return (
    <>
      <Reveal>
        <div className="flex flex-col gap-[14rem] pb-[28rem] max-md:pb-[20rem]">
          <p className="t-b1">
            <Linked text={registration.intro} links={registration.introLinks} />
          </p>
          <p className="t-b1 pt-[10rem]">{registration.feesLead}</p>
          <div>
            {/* The rules are `.fee-table` in the client stylesheet. */}
            <table className="fee-table t-b1">
              <thead>
                <tr>
                  {fees.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fees.rows.map(([category, ...amounts]) => (
                  <tr key={category}>
                    <th scope="row">{category}</th>
                    {amounts.map((a, i) => (
                      <td key={i} className="tnum">
                        {a}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="t-b2 pt-[4rem]">{fees.note}</p>
          </div>
        </div>
      </Reveal>
      {state}
    </>
  );
}

/**
 * A paragraph with some of its phrases linked: each label is found at its
 * first occurrence after the previous one, and a label the text no longer
 * carries is skipped rather than breaking the sentence. `.link-run` because
 * these run through the sentence and may wrap.
 */
function Linked({ text, links }: { text: string; links: { label: string; url: string }[] }) {
  const parts: ReactNode[] = [];
  let rest = text;
  for (const { label, url } of links) {
    const at = rest.indexOf(label);
    if (at < 0) continue;
    parts.push(
      rest.slice(0, at),
      <Link key={label} href={url} className="link-run">
        {label}
      </Link>,
    );
    rest = rest.slice(at + label.length);
  }
  parts.push(rest);
  return <>{parts}</>;
}

/** The portal sentence with its date in bold. */
function Portal() {
  const { portal, portalEmphasis } = registration;
  const at = portal.indexOf(portalEmphasis);
  if (at < 0) return <p className="t-b1">{portal}</p>;
  return (
    <p className="t-b1">
      {portal.slice(0, at)}
      <strong>{portalEmphasis}</strong>
      {portal.slice(at + portalEmphasis.length)}
    </p>
  );
}

function RegisterWindow({ variant }: { variant: "status" | "statement" }) {
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
    ) : variant === "statement" ? (
      <Reveal>
        <Portal />
      </Reveal>
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
