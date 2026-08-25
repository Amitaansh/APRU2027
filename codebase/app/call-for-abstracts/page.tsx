import Link from "next/link";
import { AbstractsState } from "@/components/cfa/AbstractsState";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { PageHead } from "@/components/ui/PageHead";
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
      <PageHead
        label="Abstracts"
        title={["Call for", "abstracts"]}
        lede="The 2027 conference welcomes submissions of papers, posters, and panels that examine solutions and challenges facing urban and environmental sustainability in the Pacific Rim through transdisciplinary collaboration, comparative studies, and cross-cultural investigation."
      />

      <Section>
        <AbstractsState />
      </Section>

      <Section label="Formats" ground="dark">
        <RuleList>
          {FORMATS.map((item, i) => (
            <IndexRow
              key={item.title}
              number={String(i + 1).padStart(2, "0")}
              title={item.title}
              body={item.body}
            />
          ))}
        </RuleList>
        <div className="grd pt-[80rem] max-md:pt-[40rem]">
          <div style={{ gridColumn: "1 / span 6" }}>
            <p className="t-h3">Abstracts are 200 words</p>
          </div>
          <div style={{ gridColumn: "8 / span 6" }} className="max-md:mt-[24rem]">
            <p className="t-b2 dim max-w-[56ch]">
              Full submission guidelines, including formatting and review criteria, will be
              published when the call opens.
            </p>
          </div>
        </div>
      </Section>

      <Section label="Key dates">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          See the{" "}
          <Link href="/program" className="link">
            programme outline
          </Link>{" "}
          and the eleven working groups, or{" "}
          <Link href="/register" className="link">
            registration
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
