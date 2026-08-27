import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { nav } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Highlights",
  description:
    "Key dates, working groups, keynotes and field trips for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights",
});

/**
 * The landing for the Highlight submenu.
 *
 * Its rows are read out of nav.json rather than written here, so the page and
 * the dropdown above it cannot disagree about what Highlight contains — adding
 * a fifth child adds a fifth row with no edit to this file.
 *
 * The blurbs are the one thing the nav cannot supply, so they live here, keyed
 * by route. A child with no blurb still renders; it just says less.
 */

const BLURBS: Record<string, string> = {
  "/highlights/key-dates":
    "Abstract deadlines, registration, and the conference itself. Dates are confirmed as they are set.",
  "/highlights/working-groups":
    "Eleven ongoing thematic groups convening across the Pacific Rim, each led from a member university.",
  "/highlights/keynotes": "Keynote and featured speakers, announced as each is confirmed.",
  "/highlights/field-trip":
    "Site visits across Singapore, run alongside the conference programme.",
};

export default function HighlightsPage() {
  const children = nav.find((item) => item.route === "/highlights")?.children ?? [];

  return (
    <>
      <PageHead
        label="Highlight"
        title={["What to", "look for"]}
        lede="The four things worth knowing before the tenth APRU-SCL conference opens in Singapore."
      />

      <Section halo="right">
        <RuleList>
          {children.map((child, i) => (
            <IndexRow
              key={child.route}
              href={child.route}
              number={String(i + 1).padStart(2, "0")}
              title={child.label}
              body={child.route ? BLURBS[child.route] : undefined}
              action="Read"
            />
          ))}
        </RuleList>
      </Section>
    </>
  );
}
