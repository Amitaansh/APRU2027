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
    "The organising and scientific committees for the 10th APRU Sustainable Cities and Landscapes conference, hosted by the NUS Department of Architecture.",
  path: "/about",
});

/**
 * The page opens straight into the committee.
 *
 * It used to lead with a conference summary — dates, location, host, the theme
 * in brief — which is what the homepage already says, and says first. About is
 * for the people behind it.
 *
 * The series sits at the foot rather than in the middle: ten years of prior
 * editions is context for the tenth, not the reason to be on this page.
 */
export default function AboutPage() {
  return (
    <>
      <PageHead
        label="About"
        title={["The tenth", "conference"]}
        lede={site.intro}
      />

      <Section label="Committee" halo="right">
        <Reveal className="rise pb-[60rem] max-md:pb-[36rem]">
          <p className="t-b1 dim max-w-[70ch]">
            The 2027 conference is organised by the Department of Architecture at the National
            University of Singapore, host of the tenth APRU-SCL conference.
          </p>
        </Reveal>
        <Committee />
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
    </>
  );
}
