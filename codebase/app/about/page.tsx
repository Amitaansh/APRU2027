import Link from "next/link";
import { Committee } from "@/components/about/Committee";
import { Card } from "@/components/ui/Card";
import { CellReveal, Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the conference",
  description:
    "Bridging Resilience(s) explores how different knowledges and practices connect and coalesce in advancing social, cultural, and environmental resilience across the Pacific Rim.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section index="§ About" title="Bridging Resilience(s)" level={1}
        bordered={false}>
        <div className="grid gap-10 md:grid-cols-12 md:gap-5">
          <Reveal className="space-y-6 md:col-span-8">
            <p className="text-lg leading-relaxed md:text-xl">{site.intro}</p>
            <p className="leading-relaxed text-muted">
              Amid climate change, economic and technological uncertainties, and
              social and environmental disruptions, cities and communities across
              the Pacific Rim are facing profound and unprecedented challenges. In
              addressing these challenges, however, the knowledge and practices of
              sustainable planning, governance, and design often remain siloed and
              fragmented.
            </p>
            <p className="leading-relaxed text-muted">
              With the theme of Bridging Resilience(s), the 2027 APRU-SCL
              conference will explore how different knowledges and practices can
              connect and coalesce in advancing social, cultural, and environmental
              resilience in cities and communities. It will further examine how
              bridging itself — the ability to network, organize, co-create, and
              forge connections — can represent a form of resilience in the face of
              crisis and disruption.
            </p>
            <p className="leading-relaxed text-muted">
              Singapore, with its unique institutional structure along with the
              challenges of density and land scarcity, provides a setting for this
              discussion. For the 2027 conference, we welcome submissions of
              papers, posters, and panels that examine solutions and challenges
              facing urban and environmental sustainability in the Pacific Rim
              through transdisciplinary collaboration, comparative studies, and
              cross-cultural investigation.
            </p>
            <p className="label-mono">
              Read the{" "}
              <Link href="/call-for-abstracts" className="text-accent hover:underline">
                call for abstracts
              </Link>{" "}
              or the{" "}
              <Link href="/program" className="text-accent hover:underline">
                program outline
              </Link>
              .
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-4">
            <Card index="§ At a glance" title={site.seriesName}>
              <dl className="space-y-4">
                <div>
                  <dt className="label-mono">Dates</dt>
                  <dd className="text-ink">{site.dates}</dd>
                </div>
                <div>
                  <dt className="label-mono">Location</dt>
                  <dd className="text-ink">{site.location}</dd>
                </div>
                <div>
                  <dt className="label-mono">Host</dt>
                  <dd className="text-ink">{site.host}</dd>
                </div>
                <div>
                  <dt className="label-mono">Network</dt>
                  <dd className="text-ink">
                    Association of Pacific Rim Universities &middot; Sustainable
                    Cities and Landscapes
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section
        index="§ Series"
        title="Ten years of APRU-SCL"
        lede="The Sustainable Cities and Landscapes program convenes an annual conference and a set of ongoing thematic working groups across the Pacific Rim. The 2027 edition in Singapore marks ten years of the network."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {site.priorEditions.map((edition, i) => (
            <CellReveal key={edition.year} index={i}>
              <Card
                index={"№ " + edition.edition}
                title={edition.theme}
                status={String(edition.year)}
              >
                <p>{edition.host}</p>
              </Card>
            </CellReveal>
          ))}
        </div>
      </Section>

      <Section
        index="§ Committee"
        title="Who is organising this"
        lede="The 2027 conference is organised by the Department of Architecture at the National University of Singapore, host of the tenth APRU-SCL conference."
      >
        <Committee />
      </Section>
    </>
  );
}
