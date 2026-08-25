"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { forums } from "@/lib/content";

/**
 * The eleven confirmed working groups (client roster, 20 Aug 2026). Leads are
 * named with their institution; contact addresses are deliberately not
 * published here — enquiries route through the organising committee.
 */
export function WorkingGroups() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-t border-line">
      {forums.workingGroups.map((group, i) => {
        const expanded = open === group.id;
        return (
          <div key={group.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : group.id)}
                aria-expanded={expanded}
                aria-controls={"wg-" + group.id}
                className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-[180ms] hover:text-accent"
              >
                <span className="label-mono pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-lg font-bold leading-tight md:text-2xl">
                  {group.title}
                </span>
                <span aria-hidden="true" className="pt-1">
                  {expanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <m.div
                  id={"wg-" + group.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 pb-8 md:grid-cols-12 md:gap-5">
                    <div className="md:col-span-3">
                      <p className="label-mono mb-3">Convenors</p>
                      <ul className="space-y-2 text-sm">
                        {group.leads.map((lead) => (
                          <li key={lead.name}>
                            <span className="text-ink">{lead.name}</span>
                            <br />
                            <span className="text-muted">{lead.institution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm leading-relaxed text-muted md:col-span-9 md:text-base">
                      {group.blurb}
                    </p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
