import { Accordion, type AccordionItem, PageHeadArt, Section } from "@apru/ui";
import { venue } from "@apru/content";
import type { VenueSection } from "@apru/content/types";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Visitors",
  description:
    "Attendee information for the 10th APRU-SCL conference: visas and entry, getting around Singapore, the SDE3 venue on the NUS Kent Ridge campus, and useful links for visitors.",
  path: "/visitors",
});

/**
 * "Copy the same structure - literally - and can use the same style as working
 * group drop down format."
 *
 * So this is the content document's own sections as folds, running the same
 * Accordion the working-group roster runs, in the order the document sets them.
 *
 * THE FOLDS ARE THE DATA NOW. This page used to name its four folds here and map
 * each one onto whichever venue.json sections belonged inside it, because the
 * board's structure and the drafted content were not the same shape. They are
 * now: venue.json carries the document's five headings, so the page walks it
 * rather than restating it, and a section added or renamed there needs no edit
 * here.
 */

/** The prose, the list, and the destinations of one section — in that order. */
function VenueBody({ section }: { section: VenueSection }) {
  const paragraphs = Array.isArray(section.body)
    ? section.body
    : section.body
      ? [section.body]
      : [];

  return (
    <div className="flex flex-col gap-[18rem]">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="t-b1 max-w-[70ch]">
          {paragraph}
        </p>
      ))}

      {section.bullets?.length ? (
        <ul className="flex flex-col gap-[14rem]">
          {section.bullets.map((bullet, i) => (
            <li key={i} className="t-b1 max-w-[70ch] flex gap-[14rem]">
              {/* A drawn marker rather than a list-style bullet: the type scale
                  sets its own leading and a browser marker sits off it. */}
              <span aria-hidden="true" className="dim flex-none">
                &#8212;
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.links?.length ? (
        <ul className="flex flex-wrap gap-x-[24rem] gap-y-[8rem]">
          {section.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer" className="t-b2 link">
                {link.label}
                <span aria-hidden="true">&#8202;&#8599;</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function VisitorsPage() {
  const items: AccordionItem[] = venue.map((section) => ({
    id: section.id,
    title: section.heading,
    children:
      section.status === "confirmed" ? (
        <VenueBody section={section} />
      ) : (
        /*
         * Accommodation is "to be updated" in the content document. The fold
         * stays, because the structure is what the client is reviewing and a
         * heading that vanishes is harder to notice than one that says so.
         */
        <p className="t-b1 dim max-w-[70ch]">
          To be announced. Details will be published here ahead of registration opening.
        </p>
      ),
  }));

  return (
    <>
      <PageHeadArt label="Visitors" title={["Visitors"]} />

      <Section>
        <Accordion items={items} />
      </Section>
    </>
  );
}
