"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { forums } from "@/lib/content";
import { workingGroupColour } from "@/lib/wg-colour";

/**
 * The eleven confirmed working groups (client roster, 20 Aug 2026). Leads are
 * named with their institution; contact addresses are deliberately not published
 * here — enquiries route through the organising committee.
 *
 * The open panel is animated with `grid-template-rows: 0fr -> 1fr`, which
 * transitions to auto height in CSS without measuring anything, so the accordion
 * needs no animation runtime. The toggle glyph is a typographic plus and minus,
 * not an icon.
 *
 * The header borrows `.idx-row` wholesale — the rule, the padding and the hover
 * sweep — so an accordion row and an index row are the same object to the eye.
 * See components/ui/IndexRow.tsx for why the header content is rendered twice.
 */
export function WorkingGroups() {
  const [open, setOpen] = useState<string | null>(null);
  const total = forums.workingGroups.length;

  return (
    <Reveal className="rulelist">
      {forums.workingGroups.map((group, i) => {
        const expanded = open === group.id;
        const cells = (
          <>
            <span
              aria-hidden="true"
              className="size-[10rem] flex-none translate-y-[-2rem] rounded-full"
              style={{ backgroundColor: workingGroupColour(i, total) }}
            />
            <span className="t-b2 dim tnum w-[50rem] flex-none max-md:w-auto">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="t-h4 flex-1">{group.title}</span>
            <span aria-hidden="true" className="t-b1 flex-none">
              {expanded ? "−" : "+"}
            </span>
          </>
        );
        return (
          <div key={group.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : group.id)}
                aria-expanded={expanded}
                aria-controls={"wg-" + group.id}
                className="idx-row idx-row--fold w-full text-left"
              >
                <span
                  className="idx-in rise"
                  style={{ transitionDelay: Math.min(i * 0.06, 0.36) + "s" }}
                >
                  {cells}
                </span>
                <span aria-hidden="true" className="idx-veil">
                  <span className="idx-in">{cells}</span>
                </span>
              </button>
            </h3>
            <div
              id={"wg-" + group.id}
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.17,0.84,0.44,1)]"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-[36rem] pl-[80rem] max-md:pl-0">
                  <p className="t-b1 dim max-w-[70ch]">{group.blurb}</p>
                  {group.leads?.length ? (
                    <ul className="flex flex-col gap-[8rem] pt-[24rem]">
                      {group.leads.map((lead) => (
                        <li key={lead.name} className="t-b2">
                          {lead.name}
                          <span className="dim"> — {lead.institution}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
