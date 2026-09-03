import { PageHead, Reveal, Section } from "@apru/ui";
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
 */
const THEMES = [
  "Climate Resilience and Nature Preservation",
  "Urban Health and Community Design",
  "Digital Urbanism and AI",
  "Coastal Resilience and Adaptation",
  "Urban Ecology and Green Infrastructure",
];

export default function FieldTripsPage() {
  return (
    <>
      <PageHead label="Highlight" title={["Field Trips"]} />

      <Section>
        <Reveal>
          <div className="t-b1 flex max-w-[74ch] flex-col gap-[24rem]">
            <p>
              We offer half-day field trips exploring Singapore&rsquo;s innovative approaches to
              sustainable urbanism. Supported by government agencies and local partners, our
              curated excursions cover the following five themes:
            </p>

            <ul className="flex flex-col gap-[10rem]">
              {THEMES.map((theme) => (
                <li key={theme} className="flex gap-[16rem]">
                  <span aria-hidden="true">&mdash;</span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>

            <p>
              Participants will experience firsthand how high-density development integrates with
              biodiversity, smart technologies, and community well-being through guided walks,
              cycling tours, and site visits to pioneering districts. Detailed itineraries and full
              descriptions for each trip will be available by December 2026 for registration.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
