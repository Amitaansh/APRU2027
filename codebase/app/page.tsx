import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Marquee } from "@/components/ui/Marquee";
import { CellReveal, Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpreadRow } from "@/components/ui/SpreadRow";
import { forums, site } from "@/lib/content";

const TEASERS = [
  {
    index: "01",
    title: "The theme",
    href: "/about",
    body: "How different knowledges and practices connect and coalesce in advancing social, cultural, and environmental resilience — and how bridging is itself a form of resilience.",
  },
  {
    index: "02",
    title: "The program",
    href: "/program",
    body: "Keynotes, thematic sessions, eleven working groups, a student symposium, and field visits across Singapore.",
  },
  {
    index: "03",
    title: "Call for abstracts",
    href: "/call-for-abstracts",
    body: "Papers, posters, and panels examining urban and environmental sustainability across the Pacific Rim. Opening soon.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee
        items={[
          "Bridging Resilience(s)",
          "10th Conference of APRU-SCL",
          "Singapore 2027",
          "Sustainable Cities & Landscapes",
        ]}
      />

      {/* Key facts (PRD §5.1) — the at-a-glance identity a visitor needs first. */}
      <section className="border-b border-line py-14 md:py-[88px]">
        <Container>
          <SpreadRow label="Dates" value={site.dates} meta="Three days" />
          <SpreadRow label="Location" value={site.location} meta="NUS Kent Ridge" />
          <SpreadRow label="Host" value={site.host} meta="CDE" />
          <SpreadRow
            label="Series"
            value={site.seriesName}
            meta={"Est. " + (site.priorEditions.at(-1)?.year ?? 2027 - site.edition)}
          />
        </Container>
      </section>

      <Section index="§01" title="An invitation" bordered={false}>
        <div className="grid gap-10 md:grid-cols-12 md:gap-5">
          <Reveal className="md:col-span-7">
            <p className="text-lg leading-relaxed md:text-xl">{site.intro}</p>
            <Link
              href="/about"
              className="label-mono mt-8 inline-flex items-center gap-2 text-ink transition-transform duration-[180ms] hover:translate-x-1"
            >
              Read the full theme <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="grid grid-cols-2 gap-x-5 gap-y-8 md:col-span-5">
            <Counter to={site.edition} label="Edition" />
            <Counter to={forums.workingGroups.length} label="Working groups" />
            <Counter to={3} label="Days" />
            <Counter to={2027} label="Year" />
          </Reveal>
        </div>
      </Section>

      <Section index="§02" title="Where to start">
        <div className="grid gap-5 md:grid-cols-3">
          {TEASERS.map((teaser, i) => (
            <CellReveal key={teaser.href} index={i}>
              <Link href={teaser.href} className="group block h-full">
                <Card
                  index={teaser.index}
                  title={teaser.title}
                  className="transition-transform duration-[180ms] group-hover:-translate-y-[3px] group-hover:border-ink"
                >
                  <p>{teaser.body}</p>
                  <span className="label-mono mt-6 inline-flex items-center gap-2 text-accent">
                    Continue <ArrowRight aria-hidden="true" className="size-3" />
                  </span>
                </Card>
              </Link>
            </CellReveal>
          ))}
        </div>
      </Section>

      {/* Prior-editions credibility note (PRD §5.1). */}
      <Section
        index="§03"
        title="The series"
        lede="APRU-SCL convenes annually across the Pacific Rim. Singapore 2027 marks ten years of the network."
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
    </>
  );
}
