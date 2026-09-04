import type { ReactNode } from "react";
import { Accordion, type AccordionItem, PageHeadArt, Section } from "@apru/ui";
import { venue } from "@apru/content";
import type { VenueSection } from "@apru/content/types";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Visitors",
  description:
    "Attendee information for the 10th APRU-SCL conference: visas and entry, getting around Singapore, the SDE3 venue on the NUS Kent Ridge campus, and what to expect on arrival.",
  path: "/visitors",
});

/**
 * "Copy the same structure - literally - and can use the same style as working
 * group drop down format."
 *
 * So this is four numbered folds in the client's own order, running the same
 * Accordion the working-group roster runs. The prose underneath is still
 * venue.json: the eight sections there are the material, and this page decides
 * which of them belongs in which of the four folds rather than restating any of
 * it.
 *
 * TWO FOLDS ARE STILL EMPTY. The board supplies copy for Getting Around only;
 * the tourist links and the campus amenities were pointed at another NUS
 * conference site to copy from, which is not something to do without being
 * asked directly. They render the designed pending state rather than being
 * dropped, so the structure the client asked for is reviewable now and the
 * copy drops into `content/venue.json` when it arrives.
 */

const by = Object.fromEntries(venue.map((section) => [section.id, section])) as Record<
  string,
  VenueSection | undefined
>;

/** One section of venue.json: its prose, and any resources it points at. */
function VenueBody({ id }: { id: string }) {
  const section = by[id];
  if (!section || section.status !== "confirmed" || !section.body) return null;

  return (
    <div className="pb-[24rem] last:pb-0">
      <h4 className="t-b2 pb-[10rem]">{section.heading}</h4>
      <p className="t-b1 max-w-[70ch]">{section.body}</p>
      {section.links?.length ? (
        <ul className="flex flex-wrap gap-x-[24rem] gap-y-[8rem] pt-[16rem]">
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

function Awaiting({ what }: { what: string }) {
  return (
    <p className="t-b1 max-w-[70ch]">
      {what} will be published here shortly, ahead of registration opening.
    </p>
  );
}

const SECTIONS: { id: string; title: string; children: ReactNode }[] = [
  {
    id: "visa",
    title: "Visa and Entry Requirements",
    children: <VenueBody id="visa" />,
  },
  {
    id: "tourist",
    title: "Useful Links for Visitors",
    children: <Awaiting what="Guidance on what to see and do around Singapore" />,
  },
  {
    id: "amenities",
    title: "Amenities within NUS Kent Ridge Campus",
    children: <Awaiting what="Food, banking, and other amenities on the Kent Ridge campus" />,
  },
  {
    id: "getting-around",
    title: "Getting Around",
    children: (
      <>
        <VenueBody id="exact-venue" />
        <VenueBody id="getting-here" />
        <VenueBody id="getting-around" />
        <VenueBody id="practicalities" />
      </>
    ),
  },
];

export default function VisitorsPage() {
  const items: AccordionItem[] = SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    children: section.children,
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
