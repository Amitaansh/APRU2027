import { PageHeadArt, Reveal, Section, ToBeAnnounced } from "@apru/ui";
import { program } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Schedule",
  description:
    "The day-by-day schedule for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027. The detailed programme is announced in March 2027.",
  path: "/programme/schedule",
});

/**
 * The page was a single "to be announced" line, because that was all there was
 * to say. The content document gives it a paragraph: what the three days hold,
 * and when the session-level timetable lands.
 *
 * NO RULES ON THE BLOCK. The client struck out the hairlines above and below it
 * -- see StatusBlock's `rules` prop. They are the boundary of a list everywhere
 * else on the site; around one sentence on an otherwise empty page they read as
 * a box drawn round it.
 *
 * NO "TO BE ANNOUNCED" EITHER, and the sentence a size down. Both are the
 * edition's call rather than this page's -- the same block on the student
 * network session page was marked the same way -- so they are `.stat-label`
 * and `.t-h3` in globals.css, not props here.
 */
export default function SchedulePage() {
  return (
    <>
      <PageHeadArt label="Programme" title={["Schedule"]} />

      <Section>
        <Reveal>
          <p className="t-b1 pb-[28rem] max-md:pb-[20rem]">
            {program.scheduleIntro}
          </p>
        </Reveal>
        <ToBeAnnounced label={program.scheduleNote} rules={false} />
      </Section>
    </>
  );
}
