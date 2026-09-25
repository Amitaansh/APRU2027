import { PageHeadArt, Reveal, Section, ToBeAnnounced } from "@apru/ui";
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
 *
 * The page now opens with the client's introduction, and the placeholder
 * names the month the details come: "Session details will be announced in
 * March 2027." Both are set as Field Trips sets its introduction and its
 * availability line, since the two pages now say the same kind of thing.
 */
export default function StudentNetworkSessionPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Student Network Session"]} />

      <Section>
        <Reveal>
          <p className="t-b1 pb-[28rem] max-md:pb-[20rem]">
            The Student Network Session offers an informal space for PhD students and
            early-career researchers to connect beyond formal conference sessions. The
            evening combines candid conversations on academic publishing with journal
            editors and experienced scholars, followed by a social mixer with interactive
            networking. This session is designed to help you gain publishing insights, find
            collaborators, and make academic networking more meaningful and enjoyable.
          </p>
        </Reveal>
        <ToBeAnnounced label="Session details will be announced in March 2027." rules={false} />
      </Section>
    </>
  );
}
