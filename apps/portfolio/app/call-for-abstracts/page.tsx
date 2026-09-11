import Link from "next/link";
import { AbstractsState } from "@apru/ui";
import { Curtain } from "@/components/motion/Curtain";
import { IndexRow, RuleList } from "@apru/ui";
import { ImportantDates } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { abstracts } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Call for abstracts",
  description:
    "Submit an abstract for an oral or poster presentation at the 10th APRU-SCL conference, Singapore 2027. Nine tracks; abstracts are 300 words; submissions close 15 November 2026.",
  path: "/call-for-abstracts",
});

/**
 * GROUND. Light until the tracks, where the curtain wipes it black, and dark
 * from there into the footer — so what can be submitted is the last thing read.
 * The curtain is a one-way door; that is why this sits below the key dates
 * rather than above them.
 *
 * THE TRACKS SIT BELOW THE CURTAIN, NOT IN IT, and so do the rules. A curtain
 * face is a pinned 100vh with `overflow: hidden`. Three format rows cleared it;
 * nine tracks and a four-line rule set would be cut off at both ends on any
 * short window. The curtain carries the one sentence that introduces them.
 *
 * HALO. Right, left, right — two half turns, leaving at the curtain.
 */
export default function CallForAbstractsPage() {
  return (
    <>
      <PageHead
        label="Abstracts"
        title={["Call for", "abstracts"]}
        lede={abstracts.intro}
      />

      <Section halo="right">
        <AbstractsState />
      </Section>

      <Section label="Key dates" halo="left">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          See the{" "}
          <Link href="/highlights/working-groups" className="link">
            twelve working groups
          </Link>{" "}
          or{" "}
          <Link href="/register" className="link">
            registration
          </Link>
          .
        </p>
      </Section>

      <Section label="Working groups" halo="right">
        <div className="flex max-w-[70ch] flex-col gap-[24rem]">
          {abstracts.coordination.map((paragraph, i) => (
            <p key={i} className="t-b1 dim">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* The darkening. 200vh, pinned, black rising from the bottom edge. */}
      <Curtain label="Tracks" halo="right">
        <p className="f-serif dim max-w-[56ch] text-[32rem] leading-[1.2] tracking-[-0.02em]">
          {abstracts.tracksLead}
        </p>
      </Curtain>

      <Section ground="dark">
        <RuleList>
          {abstracts.tracks.map((track, i) => (
            <IndexRow
              key={track}
              number={String(i + 1).padStart(2, "0")}
              title={track}
            />
          ))}
        </RuleList>

        <div className="grd pt-[70rem]">
          <div style={{ gridColumn: "1 / span 6" }}>
            <p className="t-h3">{abstracts.rulesHeading}</p>
          </div>
          <div style={{ gridColumn: "8 / span 6" }} className="max-md:mt-[24rem]">
            <ul className="flex flex-col gap-[14rem]">
              {abstracts.rules.map((rule) => (
                <li key={rule} className="t-b2 dim max-w-[56ch]">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
