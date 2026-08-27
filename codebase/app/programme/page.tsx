import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { program } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Programme",
  description:
    "Keynotes, thematic sessions, eleven working groups, a student symposium, and field visits across Singapore, 21-23 May 2027.",
  path: "/programme",
});

/**
 * The outline, and only the outline.
 *
 * It used to carry the key dates table and the whole eleven-group accordion as
 * well — two pages of material on one page. Both have pages of their own under
 * Highlight now, and this one links to them instead.
 *
 * GROUND. Light throughout; the page is short enough that the darkening would
 * be a gesture with nothing to reveal. HALO. The lane alternates right then
 * left, and the sequence ends before the footer.
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

        <Reveal className="rise pt-[40rem]">
          <p className="t-b2 dim">
            See the{" "}
            <Link href="/highlights/working-groups" className="link">
              eleven working groups
            </Link>
            , the{" "}
            <Link href="/highlights/keynotes" className="link">
              keynotes
            </Link>
            , or the{" "}
            <Link href="/highlights/key-dates" className="link">
              key dates
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      {program.scheduleStatus === "tba" ? (
        <Section label="Schedule" halo="left">
          <ToBeAnnounced
            label="Detailed programme to be announced"
            note={program.scheduleNote}
          />
        </Section>
      ) : null}
    </>
  );
}
