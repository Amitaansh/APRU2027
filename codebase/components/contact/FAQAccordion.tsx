"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { faq } from "@/lib/content";

/**
 * Hairline dividers, a numbered spine, and a plus that becomes a minus.
 *
 * Same mechanism as the working groups: `grid-template-rows: 0fr -> 1fr`
 * animates to auto height purely in CSS, so no measurement and no animation
 * library. The header is an `.idx-row` for the same reason it is there — one row
 * shape for the whole site, hover sweep included.
 */
export function FAQAccordion() {
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);

  return (
    <Reveal className="rulelist">
      {faq.map((item, i) => {
        const expanded = open === item.id;
        const cells = (
          <>
            <span className="t-b2 dim tnum w-[50rem] flex-none max-md:w-auto">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="t-h4 flex-1">{item.question}</span>
            <span aria-hidden="true" className="t-b1 flex-none">
              {expanded ? "−" : "+"}
            </span>
          </>
        );
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.id)}
                aria-expanded={expanded}
                aria-controls={"faq-" + item.id}
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
              id={"faq-" + item.id}
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.17,0.84,0.44,1)]"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="t-b1 dim max-w-[70ch] pb-[36rem] pl-[70rem] max-md:pl-0">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
