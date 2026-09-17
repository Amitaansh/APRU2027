import { Fragment } from "react";
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
 * `swatches`, `leadsFirst` and `leadsOneLine` are the three things the
 * editions disagree about. The portfolio runs the cyan-to-orange ramp from
 * wg-colour.ts, a second channel alongside the number and the title. The
 * client asked for the coloured dots to go, so that edition passes
 * `swatches={false}` and no dot is drawn — the colour was never the only
 * carrier of meaning, which is exactly why it can be dropped without taking
 * any information with it (WCAG 1.4.1).
 *
 * `leadsFirst` puts the leaders above the description instead of under it.
 * That is the order of the approved content document -- title, leaders,
 * paragraph -- and what the client circled on their review; the portfolio
 * keeps the names as a sign-off under the text.
 *
 * `leadsOneLine` sets the leaders as the content document writes them: one
 * line per group, `Name, Institution; Name, Institution`, rather than a row
 * apiece. The client asked for exactly that format after seeing the rows. The
 * portfolio keeps the rows, with an em dash before each institution.
 */
export function WorkingGroups({
  swatches = true,
  leadsFirst = false,
  leadsOneLine = false,
}: { swatches?: boolean; leadsFirst?: boolean; leadsOneLine?: boolean } = {}) {
  const total = forums.workingGroups.length;

  const items: AccordionItem[] = forums.workingGroups.map((group, i) => {
    /* One paragraph or several — see WorkingGroup.blurb for why both. */
    const blurb = (
      <div className="flex flex-col gap-[18rem]">
        {(Array.isArray(group.blurb) ? group.blurb : [group.blurb]).map((p, n) => (
          <p key={n} className="t-b1 dim max-w-[70ch]">
            {p}
          </p>
        ))}
      </div>
    );

    /* The gap between the two blocks belongs to whichever comes second. */
    const gap = leadsFirst ? "pb-[24rem]" : "pt-[24rem]";

    /*
     * A name is a link only where a page is published; `.link` rather than
     * `.link-run` so that a name in the one-line form moves to the next line
     * whole instead of breaking in the middle.
     */
    const name = (lead: (typeof group.leads)[number]) =>
      lead.profileUrl ? (
        <a href={lead.profileUrl} target="_blank" rel="noreferrer" className="link">
          {lead.name}
        </a>
      ) : (
        lead.name
      );

    const leads = !group.leads?.length ? null : leadsOneLine ? (
      <p className={"t-b2 max-w-[70ch] " + gap}>
        {group.leads.map((lead, n) => (
          <Fragment key={lead.name}>
            {n > 0 && <span className="dim">; </span>}
            {name(lead)}
            <span className="dim">, {lead.institution}</span>
          </Fragment>
        ))}
      </p>
    ) : (
      <ul className={"flex flex-col gap-[8rem] " + gap}>
        {group.leads.map((lead) => (
          <li key={lead.name} className="t-b2">
            {name(lead)}
            <span className="dim"> — {lead.institution}</span>
          </li>
        ))}
      </ul>
    );

    return {
      id: group.id,
      title: group.title,
      swatch: swatches ? workingGroupColour(i, total) : undefined,
      children: leadsFirst ? (
        <>
          {leads}
          {blurb}
        </>
      ) : (
        <>
          {blurb}
          {leads}
        </>
      ),
    };
  });

  return <Accordion items={items} />;
}
