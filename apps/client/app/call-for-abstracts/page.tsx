import Link from "next/link";
import { AbstractsState, ImportantDates, PageHeadArt, Reveal, Section } from "@apru/ui";
import { abstracts } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Call for Abstracts",
  description:
    "Submit an abstract for an oral or poster presentation at the 10th APRU-SCL conference, Singapore 2027. Nine tracks; abstracts are 300 words; submissions close 15 November 2026.",
  path: "/call-for-abstracts",
});

/**
 * A standalone item in the navigation now - the "Participate" grouping that
 * held this and Registration together is gone.
 *
 * The page carries the approved call in full: what is being asked for, the nine
 * tracks, how the open call sits alongside the working groups, and the rules a
 * submission has to meet. AbstractsState is only the status at the top of it —
 * opening soon, open, or closed — so the call itself is readable on any day
 * rather than appearing on 15 September and vanishing on 15 November.
 *
 * The key dates are trimmed to the ones that govern a submission: the window,
 * and the notification that closes it. Everything after 15 January is about
 * attending rather than submitting.
 */
export default function CallForAbstractsPage() {
  return (
    <>
      <PageHeadArt label="Call for Abstracts" title={["Call for Abstracts"]} />

      <Section>
        <Reveal>
          <p className="t-b1 max-w-[74ch] pb-[54rem] max-md:pb-[34rem]">{abstracts.intro}</p>
        </Reveal>
        <AbstractsState />
      </Section>

      <Section label="Tracks" flow>
        <Reveal>
          <p className="t-b1 max-w-[74ch] pb-[34rem]">{abstracts.tracksLead}</p>
          {/*
           * Numbered here rather than in the content. The source writes them as
           * "Track 1: AI for resilience"; carrying that prefix in the string
           * means it is wrong the moment a track is added or reordered.
           */}
          <ol className="flex flex-col gap-[14rem]">
            {abstracts.tracks.map((track, i) => (
              <li key={track} className="t-b1 flex gap-[16rem]">
                <span className="dim tnum w-[76rem] flex-none">Track {i + 1}</span>
                <span>{track}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section label="Working Groups" flow>
        <Reveal>
          <div className="flex max-w-[74ch] flex-col gap-[20rem]">
            {abstracts.coordination.map((paragraph, i) => (
              <p key={i} className="t-b1">
                {paragraph}
              </p>
            ))}
            {abstracts.workingGroupsLink && (
              <p>
                <Link href={abstracts.workingGroupsLink.url} className="t-b2 link">
                  {abstracts.workingGroupsLink.label}
                </Link>
              </p>
            )}
          </div>
        </Reveal>
      </Section>

      <Section label={abstracts.rulesHeading} flow>
        <Reveal>
          <ul className="flex max-w-[74ch] flex-col gap-[14rem]">
            {abstracts.rules.map((rule) => (
              <li key={rule} className="t-b1 flex gap-[14rem]">
                <span aria-hidden="true" className="dim flex-none">
                  &#8212;
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section label="Key Dates" flow>
        <ImportantDates through="2027-01-15" />
      </Section>
    </>
  );
}
