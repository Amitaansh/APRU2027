import Link from "next/link";
import { WorkingGroups } from "@/components/program/WorkingGroups";
import { Card } from "@/components/ui/Card";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { CellReveal, Reveal } from "@/components/ui/Reveal";
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
      <Section
        index="§ Program"
        title="What to expect"
        lede={program.intro}
        level={1}
        bordered={false}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {program.blocks.map((block, i) => (
            <CellReveal key={block.id} index={i}>
              <Card
                index={"§ 0" + (i + 1)}
                title={block.title}
                status={block.status === "tba" ? "TBA" : "Confirmed"}
              >
                <p>{block.summary}</p>
              </Card>
            </CellReveal>
          ))}
        </div>
      </Section>

      <Section
        index="§ Working groups"
        title={forums.workingGroups.length + " working groups"}
        lede={forums.intro}
      >
        <WorkingGroups />
        <p className="label-mono mt-8">
          Details on joining a working group will be published with the full
          program.{" "}
          <Link href="/call-for-abstracts" className="text-accent hover:underline">
            See the call for abstracts
          </Link>
          .
        </p>
      </Section>

      <Section index="§ Schedule" title="Schedule">
        {program.scheduleStatus === "tba" ? (
          <ToBeAnnounced
            label="Detailed program to be announced"
            note={program.scheduleNote}
          />
        ) : null}
      </Section>

      <Section index="§ Dates" title="Important dates">
        <Reveal>
          <ImportantDates />
        </Reveal>
      </Section>
    </>
  );
}
