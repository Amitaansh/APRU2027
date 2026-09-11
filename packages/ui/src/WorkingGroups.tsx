import { Accordion, type AccordionItem } from "./Accordion";
import { forums } from "@apru/content";
import { workingGroupColour } from "./wg-colour";

/**
 * The twelve confirmed working groups, alphabetical by title (content review,
 * 3 Sep 2026). Leads are named with their institution and, where one is
 * published, linked to their own faculty or CV page.
 *
 * NOT TO AN ADDRESS. These were `mailto:` links until the review asked for the
 * opposite — "to protect privacy and prevent spam, please link to their
 * university CV page instead of displaying their email address". A lead with no
 * page published is not a link, and the institution is stated either way, which
 * is the condition the review set for that case.
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
        {/* One paragraph or several — see WorkingGroup.blurb for why both. */}
        <div className="flex flex-col gap-[18rem]">
          {(Array.isArray(group.blurb) ? group.blurb : [group.blurb]).map((p, n) => (
            <p key={n} className="t-b1 dim max-w-[70ch]">
              {p}
            </p>
          ))}
        </div>
        {group.leads?.length ? (
          <ul className="flex flex-col gap-[8rem] pt-[24rem]">
            {group.leads.map((lead) => (
              <li key={lead.name} className="t-b2">
                {lead.profileUrl ? (
                  <a
                    href={lead.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
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
