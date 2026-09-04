import { PageHeadArt, Section, ToBeAnnounced } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Students Network Session",
  description:
    "The students network session at the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights/students-network-session",
});

/** "Add this page, keep it empty with just page title is fine for now." */
export default function StudentsNetworkSessionPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Students Network Session"]} />

      <Section>
        <ToBeAnnounced label="Session details to be announced" />
      </Section>
    </>
  );
}
