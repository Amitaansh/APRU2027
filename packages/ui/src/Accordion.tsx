"use client";

import { useState, type ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * The fold-out row, extracted from the working-group roster so Visitors can use
 * it too — the client asked for that page to take "the same style as working
 * group drop down format", and the way to honour that is to run the same
 * component rather than to copy its markup.
 *
 * The open panel is animated with `grid-template-rows: 0fr -> 1fr`, which
 * transitions to auto height in CSS without measuring anything, so the
 * accordion needs no animation runtime. The toggle glyph is a typographic plus
 * and minus, not an icon.
 *
 * The header borrows `.idx-row` wholesale — the rule, the padding and the hover
 * sweep — so a fold and an index row are the same object to the eye. That also
 * means it inherits whatever the edition has decided about the sweep: the
 * client's stylesheet removes `.idx-veil` outright, and this needs no branch to
 * know about it.
 *
 * ONE OPEN AT A TIME. A roster is read by comparison, and letting every panel
 * stand open turns the list into a wall that has to be scrolled past rather
 * than scanned.
 */

export interface AccordionItem {
  id: string;
  title: string;
  /** A colour dot before the number. Omitted, no dot is drawn. */
  swatch?: string;
  children: ReactNode;
}

export function Accordion({
  items,
  numbered = true,
  headingLevel: Heading = "h3",
}: {
  items: AccordionItem[];
  /** Two-digit index before each title. */
  numbered?: boolean;
  /** So a page can place these correctly under its own heading structure. */
  headingLevel?: "h2" | "h3";
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Reveal className="rulelist">
      {items.map((item, i) => {
        const expanded = open === item.id;
        /*
         * The header content is rendered twice — once live, once inside the
         * aria-hidden `.idx-veil` duplicate that the hover fill sweeps across.
         * See IndexRow.tsx for why the duplicate exists rather than a filter.
         */
        const cells = (
          <>
            {item.swatch && (
              <span
                aria-hidden="true"
                className="size-[10rem] flex-none translate-y-[-2rem] rounded-full"
                style={{ backgroundColor: item.swatch }}
              />
            )}
            {numbered && (
              <span className="t-b2 dim tnum w-[50rem] flex-none max-md:w-auto">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <span className="t-h4 flex-1">{item.title}</span>
            <span aria-hidden="true" className="t-b1 flex-none">
              {expanded ? "−" : "+"}
            </span>
          </>
        );

        return (
          <div key={item.id}>
            <Heading>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.id)}
                aria-expanded={expanded}
                aria-controls={"fold-" + item.id}
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
            </Heading>
            <div
              id={"fold-" + item.id}
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.17,0.84,0.44,1)]"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-[36rem] pl-[80rem] max-md:pl-0">{item.children}</div>
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
