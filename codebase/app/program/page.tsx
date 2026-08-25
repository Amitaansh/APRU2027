import Link from "next/link";
import { WorkingGroups } from "@/components/program/WorkingGroups";
import { Reveal } from "@/components/motion/Reveal";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { forums, program } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Program",
  description:
    "Keynotes, thematic sessions, eleven working groups, a student symposium, and field visits across Singapore, 21-23 May 2027.",
  path: "/program",
});

export default function ProgramPage() {
  return (
    <>
      <PageHead
        label="Programme"
        title={["What to", "expect"]}
        lede={program.intro}
      />

      <Section label="Sessions">
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

      {/*
       * The one page where colour carries information: each working group gets a
       * swatch from a ramp between the halo blue and the key-art orange. The
       * number and the title still identify the group, so the colour is a second
       * channel rather than the only one.
       */}
      <Section
        label="Working groups"
        ground="dark"
      >
        <Reveal className="rise pb-[60rem] max-md:pb-[36rem]">
          <p className="t-b1 dim max-w-[70ch]">{forums.intro}</p>
        </Reveal>
        <WorkingGroups />
        <p className="t-b2 dim pt-[40rem]">
          Details on joining a working group will be published with the full programme.{" "}
          <Link href="/call-for-abstracts" className="link">
            See the call for abstracts
          </Link>
          .
        </p>
      </Section>

      {program.scheduleStatus === "tba" ? (
        <Section label="Schedule">
          <ToBeAnnounced
            label="Detailed programme to be announced"
            note={program.scheduleNote}
          />
        </Section>
      ) : null}

      <Section label="Key dates" flow={program.scheduleStatus === "tba"}>
        <ImportantDates />
      </Section>
    </>
  );
}
