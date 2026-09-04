import { PageHeadArt, Section, ToBeAnnounced } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Schedule",
  description:
    "The day-by-day schedule for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/programme/schedule",
});

/**
 * "Just keep this page empty." The one line the client wrote is the whole page.
 *
 * The invitation to be notified that used to sit here is gone with it: there is
 * no mailing list to sign up to yet, and the client was explicit that we should
 * not imply otherwise.
 */
export default function SchedulePage() {
  return (
    <>
      <PageHeadArt label="Programme" title={["Schedule"]} />

      <Section>
        <ToBeAnnounced label="Detailed schedule and programme to be announced soon." />
      </Section>
    </>
  );
}
