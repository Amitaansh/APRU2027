import { PageHeadArt, Section, SpeakerGrid } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Keynotes",
  description:
    "Keynote and featured speakers for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights/keynotes",
});

/**
 * No lede: the client asked for the subtext to come off every page.
 *
 * `profile` is the row shape the client asked for -- name at text weight, the
 * position and institution on a line under it, no "Keynote" tag beside the
 * headshot. See SpeakerGrid for the two shapes.
 */
export default function KeynotesPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Keynotes"]} />

      <Section>
        <SpeakerGrid variant="profile" />
      </Section>
    </>
  );
}
