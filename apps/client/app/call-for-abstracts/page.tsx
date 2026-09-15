import type { ReactNode } from "react";
import Link from "next/link";
import { CTAButton, ImportantDates, PageHeadArt, Reveal, Section } from "@apru/ui";
import { abstracts } from "@apru/content";
import { phases } from "@apru/content/phases";
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
 * SET AS THE CONTENT DOCUMENT SETS IT. "Use exactly the format from master web
 * content; no need sub-headings; remove 'to be announced' section; add
 * [Submission Open Soon] button." The call is one run of copy there: the
 * intro, the nine tracks, the two paragraphs on how the open call sits beside
 * the working groups, the dates, the rules, and a button. So it is one Section
 * here, with "Key Dates" and "Submission Rules" as bold lines in the flow rather
 * than as labels down the side, and nothing else in between.
 *
 * What came out: the four Section labels, the status block that used to open
 * the page, and the "See the working groups" line -- the source links the words
 * "Working Groups" inside the paragraph instead, so that is where the link is.
 *
 * THE BUTTON IS LIVE, not "open soon". The source still carries the placeholder
 * it was written with, but the window opened on 15 September and the portal is
 * the same UVENTs page registration will use; the client confirmed the live
 * link. CTAButton is date-aware only through the target it is given, and
 * `phases.cta.abstracts` always has its URL, so the button says "Submit an
 * abstract" and goes there. If the client wants the placeholder back, blank the
 * URL in phases.ts and CTAButton renders the inert affordance on its own.
 *
 * The dates run through the early-bird deadline because the source lists it
 * here. It says 1 March there and 28 February on the Key Dates page; dates.json
 * has the 28th, and this page reads the same rows, so the site agrees with
 * itself and the discrepancy is raised with the client rather than picked.
 */
export default function CallForAbstractsPage() {
  return (
    <>
      <PageHeadArt label="Call for Abstracts" title={["Call for Abstracts"]} />

      <Section>
        <Reveal>
          <div className="flex max-w-[74ch] flex-col gap-[20rem]">
            <p className="t-b1">{abstracts.intro}</p>

            <p className="t-b1 pt-[14rem]">{abstracts.tracksLead}</p>
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

            {abstracts.coordination.map((paragraph, i) => (
              <p key={i} className={"t-b1" + (i === 0 ? " pt-[14rem]" : "")}>
                <Marked paragraph={paragraph} link={i === 0} />
              </p>
            ))}

            {abstracts.datesHeading && (
              <p className="t-b1 pt-[14rem] font-bold">{abstracts.datesHeading}</p>
            )}
            {/*
             * The four dates the source lists under the call: opens, deadline,
             * notification, early-bird. Registration day falls inside that
             * range but is not in the source's list, so it is omitted by id.
             */}
            <ImportantDates through="2027-02-28" omit={["registration-opens"]} variant="lines" />

            <p className="t-b1 pt-[14rem] font-bold">{abstracts.rulesHeading}</p>
            <ul className="flex flex-col gap-[14rem]">
              {abstracts.rules.map((rule) => (
                <li key={rule} className="t-b1 flex gap-[14rem]">
                  <span aria-hidden="true" className="dim flex-none">
                    &#8212;
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-[54rem] max-md:pt-[34rem]">
            <CTAButton page="cfa" surface="inline" target={phases.cta.abstracts} />
          </div>
        </Reveal>
      </Section>
    </>
  );
}

/**
 * One paragraph of the coordination copy with the two things the source marks
 * inside it put back: the words "Working Groups" as a link to that page, and
 * the caveat sentence in bold. Both are found by their first occurrence and a
 * paragraph that carries neither renders as plain text.
 *
 * `link` is opt-in per paragraph because the phrase recurs: the second
 * paragraph says "Working Groups" twice more, and the source links only the
 * first mention in the first.
 */
function Marked({ paragraph, link: wantLink = false }: { paragraph: string; link?: boolean }) {
  const parts: ReactNode[] = [];
  let rest = paragraph;
  let key = 0;

  const link = abstracts.workingGroupsLink;
  if (wantLink && link && rest.includes(link.label)) {
    const [before, after] = splitOnce(rest, link.label);
    parts.push(
      before,
      <Link key={key++} href={link.url} className="link">
        {link.label}
      </Link>,
    );
    rest = after;
  }

  const bold = abstracts.emphasis;
  if (bold && rest.includes(bold)) {
    const [before, after] = splitOnce(rest, bold);
    parts.push(before, <strong key={key++}>{bold}</strong>);
    rest = after;
  }

  parts.push(rest);
  return <>{parts}</>;
}

function splitOnce(text: string, needle: string): [string, string] {
  const at = text.indexOf(needle);
  return [text.slice(0, at), text.slice(at + needle.length)];
}
