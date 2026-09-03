import Link from "next/link";
import { AbstractsState } from "@apru/ui";
import { Curtain } from "@/components/motion/Curtain";
import { IndexRow, RuleList } from "@apru/ui";
import { ImportantDates } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

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

/**
 * GROUND. Light until the formats, where the curtain wipes it black, and dark
 * from there into the footer — so the three things that can be submitted are the
 * last thing read. The curtain is a one-way door; that is why the formats moved
 * below the key dates rather than sitting above them.
 *
 * The word count sits BELOW the curtain rather than in it. A curtain face is a
 * pinned 100vh with `overflow: hidden`, and three rows plus a display-size
 * spread would not clear it on a short window.
 *
 * HALO. Right, left, right — two half turns, leaving at the curtain.
 */
export default function CallForAbstractsPage() {
  return (
    <>
      <PageHead
        label="Abstracts"
        title={["Call for", "abstracts"]}
        lede="The 2027 conference welcomes submissions of papers, posters, and panels that examine solutions and challenges facing urban and environmental sustainability in the Pacific Rim through transdisciplinary collaboration, comparative studies, and cross-cultural investigation."
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

      {/* The darkening. 200vh, pinned, black rising from the bottom edge. */}
      <Curtain label="Formats" halo="right">
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
      </Curtain>

      <Section ground="dark">
        <div className="grd">
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
    </>
  );
}
