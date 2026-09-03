import Link from "next/link";
import { Reveal } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Field trip",
  description:
    "Half-day field trips across Singapore on climate resilience, urban health, digital urbanism, coastal adaptation and urban ecology, run alongside the 10th APRU Sustainable Cities and Landscapes conference, 21-23 May 2027.",
  path: "/highlights/field-trip",
});

/**
 * One continuous block, at the client's instruction — the five themes are a list
 * inside the description rather than five sections with headings of their own.
 * Splitting them would promise per-trip detail the page cannot yet carry;
 * itineraries land December 2026.
 */
const THEMES = [
  "Climate Resilience and Nature Preservation",
  "Urban Health and Community Design",
  "Digital Urbanism and AI",
  "Coastal Resilience and Adaptation",
  "Urban Ecology and Green Infrastructure",
];

export default function FieldTripPage() {
  return (
    <>
      <PageHead
        label="Highlight"
        title={["Field trip"]}
        lede="Half-day visits across Singapore, supported by government agencies and local partners, exploring the city's approaches to sustainable urbanism."
      />

      <Section halo="right">
        <Reveal>
          <div className="t-b1 flex max-w-[70ch] flex-col gap-[26rem]">
            <p className="rise">
              We offer half-day field trips exploring Singapore&rsquo;s innovative approaches
              to sustainable urbanism. Supported by government agencies and local partners,
              our curated excursions cover the following five themes:
            </p>

            <ul className="rise flex flex-col gap-[10rem]" style={{ transitionDelay: "0.08s" }}>
              {THEMES.map((theme) => (
                <li key={theme} className="flex gap-[16rem]">
                  <span aria-hidden="true" className="dim">
                    &mdash;
                  </span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>

            <p className="rise" style={{ transitionDelay: "0.16s" }}>
              Participants will experience firsthand how high-density development integrates
              with biodiversity, smart technologies, and community well-being through guided
              walks, cycling tours, and site visits to pioneering districts. Detailed
              itineraries and full descriptions for each trip will be available by December
              2026 for registration.
            </p>
          </div>
        </Reveal>

        <p className="t-b2 dim pt-[40rem]">
          See the{" "}
          <Link href="/programme/schedule" className="link">
            conference schedule
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
