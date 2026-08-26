import Link from "next/link";
import { WorkingGroups } from "@/components/program/WorkingGroups";
import { Curtain } from "@/components/motion/Curtain";
import { Reveal } from "@/components/motion/Reveal";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { forums, program } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Programme",
  description:
    "Keynotes, thematic sessions, eleven working groups, a student symposium, and field visits across Singapore, 21-23 May 2027.",
  path: "/programme",
});

/**
 * GROUND. Light until the working groups, where the curtain wipes it black, and
 * dark from there into the footer. That is why the groups now sit at the foot of
 * the page rather than in the middle of it: the curtain is a one-way door, and
 * darkening only to cut straight back to paper would read worse than the hard
 * seam it replaces.
 *
 * The eleven groups themselves stay BELOW the curtain, not inside it. The
 * curtain's face is a pinned 100vh with `overflow: hidden`, and an accordion
 * opening inside it would have its answer clipped.
 *
 * HALO. The lane alternates right, left, right, left down the page -- a half
 * turn of the mark at each seam -- and the sequence ends at the curtain, after
 * which the page runs full width.
 */
export default function ProgramPage() {
  return (
    <>
      <PageHead
        label="Programme"
        title={["What to", "expect"]}
        lede={program.intro}
      />

      <Section label="Sessions" halo="right">
        <RuleList>
          {program.blocks.map((block, i) => (
            <IndexRow
              key={block.id}
              number={String(i + 1).padStart(2, "0")}
              title={block.title}
              body={block.summary}
              meta={
                <span className={block.status === "tba" ? "dim" : "live"}>
                  {block.status === "tba" ? "To be confirmed" : "Confirmed"}
                </span>
              }
            />
          ))}
        </RuleList>
      </Section>

      {program.scheduleStatus === "tba" ? (
        <Section label="Schedule" halo="left">
          <ToBeAnnounced
            label="Detailed programme to be announced"
            note={program.scheduleNote}
          />
        </Section>
      ) : null}

      {/*
       * Pays the full rhythm rather than flowing on from the schedule above it,
       * as it used to. Both are lane sections now, and the halo turns edge-on in
       * the gap between them -- with no gap there is nowhere to make the turn.
       */}
      <Section label="Key dates" halo="right">
        <ImportantDates />
      </Section>

      {/* The darkening. 200vh, pinned, black rising from the bottom edge. */}
      <Curtain label="Working groups" halo="left">
        <Reveal className="rise">
          <p className="t-b1 dim max-w-[70ch]">{forums.intro}</p>
        </Reveal>
      </Curtain>

      {/*
       * The one page where colour carries information: each working group gets a
       * swatch from a ramp between the halo blue and the key-art orange. The
       * number and the title still identify the group, so the colour is a second
       * channel rather than the only one.
       */}
      <Section ground="dark">
        <WorkingGroups />
        <p className="t-b2 dim pt-[40rem]">
          Details on joining a working group will be published with the full programme.{" "}
          <Link href="/call-for-abstracts" className="link">
            See the call for abstracts
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
