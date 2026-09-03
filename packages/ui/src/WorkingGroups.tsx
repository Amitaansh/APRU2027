import { Accordion, type AccordionItem } from "./Accordion";
import { forums } from "@apru/content";
import { workingGroupColour } from "./wg-colour";

/**
 * The twelve confirmed working groups (client roster, 20 Aug 2026). Leads are
 * named with their institution and, where the proposals document gives one, an
 * address — these are the contacts a prospective member is meant to write to,
 * which is the opposite of the committee roster, where addresses are withheld
 * behind `showEmails`. A lead with no address published is simply not a link.
 *
 * The fold itself is Accordion, shared with the Visitors page. This file is now
 * only the mapping from working-group data onto it.
 *
 * `swatches` is the one thing the two editions disagree about. The portfolio
 * runs the cyan-to-orange ramp from wg-colour.ts, a second channel alongside
 * the number and the title. The client asked for the coloured dots to go, so
 * that edition passes `swatches={false}` and no dot is drawn — the colour was
 * never the only carrier of meaning, which is exactly why it can be dropped
 * without taking any information with it (WCAG 1.4.1).
 */
export function WorkingGroups({ swatches = true }: { swatches?: boolean } = {}) {
  const total = forums.workingGroups.length;

  const items: AccordionItem[] = forums.workingGroups.map((group, i) => ({
    id: group.id,
    title: group.title,
    swatch: swatches ? workingGroupColour(i, total) : undefined,
    children: (
      <>
        <p className="t-b1 dim max-w-[70ch]">{group.blurb}</p>
        {group.leads?.length ? (
          <ul className="flex flex-col gap-[8rem] pt-[24rem]">
            {group.leads.map((lead) => (
              <li key={lead.name} className="t-b2">
                {lead.email ? (
                  <a href={"mailto:" + lead.email} className="link">
                    {lead.name}
                  </a>
                ) : (
                  lead.name
                )}
                <span className="dim"> — {lead.institution}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </>
    ),
  }));

  return <Accordion items={items} />;
}
