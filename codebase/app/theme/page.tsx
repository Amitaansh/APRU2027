import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The theme",
  description:
    "Bridging Resilience(s) explores how different knowledges and practices connect and coalesce in advancing social, cultural, and environmental resilience across the Pacific Rim.",
  path: "/theme",
});

export default function ThemePage() {
  return (
    <>
      <PageHead
        label="Theme"
        title={["Bridging", "Resilience(s)"]}
        lede="How different knowledges and practices connect and coalesce in advancing social, cultural, and environmental resilience — and how bridging is itself a form of resilience."
      />

      <Section label="The theme" halo="right">
        <Reveal>
          <div className="t-b1 flex max-w-[70ch] flex-col gap-[26rem]">
            <p className="rise">
              Amid climate change, economic and technological uncertainties, and social and
              environmental disruptions, cities and communities across the Pacific Rim are
              facing profound and unprecedented challenges. In addressing these challenges,
              however, the knowledge and practices of sustainable planning, governance, and
              design often remain siloed and fragmented.
            </p>
            <p className="rise" style={{ transitionDelay: "0.08s" }}>
              With the theme of Bridging Resilience(s), the 2027 APRU-SCL conference will
              explore how different knowledges and practices can connect and coalesce in
              advancing social, cultural, and environmental resilience in cities and
              communities. It will further examine how bridging itself — the ability to network,
              organize, co-create, and forge connections — can represent a form of resilience in
              the face of crisis and disruption.
            </p>
            <p className="rise" style={{ transitionDelay: "0.16s" }}>
              Singapore, with its unique institutional structure along with the challenges of
              density and land scarcity, provides a setting for this discussion. For the 2027
              conference, we welcome submissions of papers, posters, and panels that examine
              solutions and challenges facing urban and environmental sustainability in the
              Pacific Rim through transdisciplinary collaboration, comparative studies, and
              cross-cultural investigation.
            </p>
            <p className="t-b2 dim rise" style={{ transitionDelay: "0.24s" }}>
              Read the{" "}
              <Link href="/call-for-abstracts" className="link">
                call for abstracts
              </Link>{" "}
              or the{" "}
              <Link href="/programme" className="link">
                programme outline
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
