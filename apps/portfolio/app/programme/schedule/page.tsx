import { PageHead, Section, ToBeAnnounced } from "@apru/ui";
import { program } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Schedule",
  description:
    "The day-by-day schedule for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027. Published as sessions are confirmed.",
  path: "/programme/schedule",
});

/**
 * The schedule's own page, split out of the Programme landing at the client's
 * request. There is nothing to put on it yet, so it carries the designed
 * to-be-announced state rather than a blank region — see ToBeAnnounced.
 *
 * The session outline that used to sit above this is gone: the client asked for
 * it to come out along with the landing page it lived on.
 */
export default function SchedulePage() {
  return (
    <>
      <PageHead
        label="Programme"
        title={["Schedule"]}
        lede="The three-day schedule will be published here once sessions are confirmed."
      />

      <Section halo="right">
        <ToBeAnnounced
          label="Detailed schedule and programme to be announced"
          note={program.scheduleNote}
        />
      </Section>
    </>
  );
}
