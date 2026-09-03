import { Committee, PageHead, Reveal, Section, Sponsors } from "@apru/ui";
import { site } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "The 10th APRU Sustainable Cities and Landscapes conference, hosted by the NUS Department of Architecture, and the committees behind it.",
  path: "/about",
});

/**
 * About absorbs most of what came off the home page.
 *
 * The client asked for the title to become simply "About", for the text beside
 * it to move down under it, for the intro paragraph and the sponsor marks to
 * arrive here from the home page, and for "The series" to go.
 *
 * The theme statement came here too. That was a judgement call: the brief says
 * to remove the "The Theme" heading and the display setting of "Bridging
 * Resilience(s)" from the home page, and it does not say where the three
 * paragraphs underneath should end up — but they are the substance of the
 * conference and dropping them outright would leave the site with no account of
 * what it is for. They read as body copy here. Say the word if they should go.
 *
 * No lede is passed to PageHead: that prop is what sets a paragraph beside the
 * title, and moving it down is precisely the request.
 */
export default function AboutPage() {
  return (
    <>
      <PageHead label="About" title={["About"]} />

      <Section>
        <Reveal>
          <div className="t-b1 flex max-w-[74ch] flex-col gap-[24rem]">
            <p>{site.intro}</p>
            <p>
              Amid climate change, economic and technological uncertainties, and social and
              environmental disruptions, cities and communities across the Pacific Rim are facing
              profound and unprecedented challenges. In addressing these challenges, however, the
              knowledge and practices of sustainable planning, governance, and design often remain
              siloed and fragmented.
            </p>
            <p>
              With the theme of Bridging Resilience(s), the 2027 APRU-SCL conference will explore
              how different knowledges and practices can connect and coalesce in advancing social,
              cultural, and environmental resilience in cities and communities. It will further
              examine how bridging itself — the ability to network, organize, co-create, and forge
              connections — can represent a form of resilience in the face of crisis and
              disruption.
            </p>
            <p>
              Singapore, with its unique institutional structure along with the challenges of
              density and land scarcity, provides a setting for this discussion. For the 2027
              conference, we welcome submissions of papers, posters, and panels that examine
              solutions and challenges facing urban and environmental sustainability in the Pacific
              Rim through transdisciplinary collaboration, comparative studies, and cross-cultural
              investigation.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Everyone in one grid, three to a row — see the `leads` prop. */}
      <Section flow>
        <Committee leads="inline" />
      </Section>

      {/* "Change sponsors and partners to supported by." */}
      <Section flow>
        <Sponsors heading="Supported by" variant="grid" />
      </Section>
    </>
  );
}
