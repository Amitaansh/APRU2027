import { PageHeadArt, Reveal, Section, ToBeAnnounced } from "@apru/ui";
import { fieldTrip } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Field Trips",
  description:
    "Half-day field trips across Singapore on climate resilience, urban health, digital urbanism, coastal adaptation and urban ecology, run alongside the 10th APRU Sustainable Cities and Landscapes conference, 21-23 May 2027.",
  path: "/highlights/field-trip",
});

/**
 * One continuous block, at the client instruction - the five themes are a list
 * inside the description rather than five sections with headings of their own.
 *
 * The copy moved into @apru/content when the approved content document landed.
 * It was written out here first and matched the document word for word, but the
 * portfolio edition had its own copy of it, and two copies of the same approved
 * paragraph is exactly how the two editions come to disagree.
 *
 * The closing sentence -- when the itineraries land -- is a paragraph of its
 * own, at the client's request; it is `availability` in the data. It is now
 * set as the schedule sets its "detailed program will be announced" line --
 * the same status block, same size, same gap above it -- because the two
 * sentences say the same kind of thing: this is when the detail lands.
 */

export default function FieldTripsPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Field Trips"]} />

      <Section>
        <Reveal>
          <div className="t-b1 flex flex-col gap-[14rem] pb-[28rem] max-md:pb-[20rem]">
            <p>{fieldTrip.intro}</p>

            <ul className="flex flex-col gap-[6rem]">
              {fieldTrip.themes.map((theme) => (
                <li key={theme} className="flex gap-[16rem]">
                  <span aria-hidden="true">&mdash;</span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>

            <p>{fieldTrip.note}</p>
          </div>
        </Reveal>
        <ToBeAnnounced label={fieldTrip.availability} rules={false} />
      </Section>
    </>
  );
}
