import Link from "next/link";
import { AbstractsState } from "@/components/cfa/AbstractsState";
import { Card } from "@/components/ui/Card";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { CellReveal, Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Call for abstracts",
  description:
    "Papers, posters, and panels for the 10th APRU-SCL conference, Singapore 2027. Abstracts are 200 words. The call opens soon.",
  path: "/call-for-abstracts",
});

const FORMATS = [
  {
    title: "Papers",
    body: "Individual research contributions examining solutions and challenges in urban and environmental sustainability across the Pacific Rim.",
  },
  {
    title: "Posters",
    body: "Visual presentations of work in progress, well suited to comparative and field-based studies.",
  },
  {
    title: "Panels",
    body: "Proposed sessions bringing several contributors together around a shared question, in the spirit of the working group framework.",
  },
];

export default function CallForAbstractsPage() {
  return (
    <>
      <Section
        index="§ Abstracts"
        title="Call for abstracts"
        lede="The 2027 conference welcomes submissions of papers, posters, and panels that examine solutions and challenges facing urban and environmental sustainability in the Pacific Rim through transdisciplinary collaboration, comparative studies, and cross-cultural investigation."
        level={1}
        bordered={false}
      >
        <Reveal>
          <AbstractsState />
        </Reveal>
      </Section>

      <Section index="§ Formats" title="What you can submit">
        <div className="grid gap-5 md:grid-cols-3">
          {FORMATS.map((item, i) => (
            <CellReveal key={item.title} index={i}>
              <Card index={"§ 0" + (i + 1)} title={item.title}>
                <p>{item.body}</p>
              </Card>
            </CellReveal>
          ))}
        </div>
        <div className="mt-10 border border-line bg-surface p-6 md:p-8">
          <p className="label-mono text-accent">§ Convention</p>
          <p className="mt-3 font-display text-xl font-bold md:text-2xl">
            Abstracts are 200 words
          </p>
          <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted">
            Full submission guidelines, including formatting and review criteria, will be published
            when the call opens.
          </p>
        </div>
      </Section>

      <Section index="§ Dates" title="Important dates">
        <Reveal>
          <ImportantDates />
        </Reveal>
        <p className="label-mono mt-8">
          See the{" "}
          <Link href="/program" className="text-accent hover:underline">
            program outline
          </Link>{" "}
          and the eleven working groups, or{" "}
          <Link href="/register" className="text-accent hover:underline">
            registration
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
