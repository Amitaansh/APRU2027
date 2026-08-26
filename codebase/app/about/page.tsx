import Link from "next/link";
import { Committee } from "@/components/about/Committee";
import { Reveal } from "@/components/motion/Reveal";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the conference",
  description:
    "The 10th APRU Sustainable Cities and Landscapes conference, hosted by the NUS Department of Architecture — ten years of the network, and the committee organising the 2027 edition.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHead
        label="About"
        title={["The tenth", "conference"]}
        lede={site.intro}
      />

      <Section label="The conference" halo="right">
        <div className="flex gap-[40rem] max-md:flex-col">
          <div className="flex-1">
            <Reveal>
              <div className="t-b1 flex flex-col gap-[26rem]">
                <p className="rise">
                  The 2027 conference takes the theme of Bridging Resilience(s): how different
                  knowledges and practices can connect and coalesce in advancing social,
                  cultural, and environmental resilience in cities and communities across the
                  Pacific Rim.
                </p>
                <p className="t-b2 dim rise" style={{ transitionDelay: "0.08s" }}>
                  Read the{" "}
                  <Link href="/theme" className="link">
                    theme in full
                  </Link>{" "}
                  or the{" "}
                  <Link href="/programme" className="link">
                    programme outline
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </div>

          <div className="w-[280rem] flex-none max-md:mt-[50rem] max-md:w-full">
            <Reveal>
              <dl className="flex flex-col gap-[26rem]">
                {[
                  ["Dates", site.dates],
                  ["Location", site.location],
                  ["Host", site.host],
                  [
                    "Network",
                    "Association of Pacific Rim Universities · Sustainable Cities and Landscapes",
                  ],
                ].map(([term, value], i) => (
                  <div
                    key={term}
                    className="rise flex flex-col gap-[6rem]"
                    style={{ transitionDelay: i * 0.06 + "s" }}
                  >
                    <dt className="t-lbl dim">{term}</dt>
                    <dd className="t-b2">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section label="The series" ground="dark" halo="left">
        <Reveal className="rise pb-[60rem] max-md:pb-[36rem]">
          <p className="t-b1 dim max-w-[70ch]">
            The Sustainable Cities and Landscapes programme convenes an annual conference and a set
            of ongoing thematic working groups across the Pacific Rim. The 2027 edition in Singapore
            marks ten years of the network.
          </p>
        </Reveal>
        <RuleList>
          {site.priorEditions.map((edition) => (
            <IndexRow
              key={edition.year}
              number={String(edition.edition).padStart(2, "0")}
              title={edition.theme}
              body={edition.host}
              meta={<span className="tnum">{edition.year}</span>}
            />
          ))}
        </RuleList>
      </Section>

      <Section label="Committee" halo="right">
        <Reveal className="rise pb-[60rem] max-md:pb-[36rem]">
          <p className="t-b1 dim max-w-[70ch]">
            The 2027 conference is organised by the Department of Architecture at the National
            University of Singapore, host of the tenth APRU-SCL conference.
          </p>
        </Reveal>
        <Committee />
      </Section>
    </>
  );
}
