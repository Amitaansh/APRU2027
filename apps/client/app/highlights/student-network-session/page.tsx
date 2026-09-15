import { PageHeadArt, Section, ToBeAnnounced } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Student Network Session",
  description:
    "The student network session at the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights/student-network-session",
});

/**
 * "Add this page, keep it empty with just page title is fine for now."
 *
 * Singular, per the content document and the client's "remove s". The route
 * went singular with it; vercel.json redirects the old slug.
 */
export default function StudentNetworkSessionPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Student Network Session"]} />

      <Section>
        <ToBeAnnounced label="Session details to be announced" />
      </Section>
    </>
  );
}
