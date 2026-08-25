"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { faq } from "@/lib/content";

/** Design Brief §07.07 — hairline dividers, mono index, ease-in-out expand. */
export function FAQAccordion() {
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);

  return (
    <div className="border-t border-line">
      {faq.map((item, i) => {
        const expanded = open === item.id;
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.id)}
                aria-expanded={expanded}
                aria-controls={"faq-" + item.id}
                className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-[180ms] hover:text-accent"
              >
                <span className="label-mono pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-base font-bold leading-tight md:text-xl">
                  {item.question}
                </span>
                <span aria-hidden="true" className="pt-1">
                  {expanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <m.div
                  id={"faq-" + item.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[70ch] pb-8 pl-0 text-sm leading-relaxed text-muted md:pl-16 md:text-base">
                    {item.answer}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
