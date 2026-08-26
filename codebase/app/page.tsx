import { Hero } from "@/components/home/Hero";
import { Curtain } from "@/components/motion/Curtain";
import { Preloader } from "@/components/motion/Preloader";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { Section } from "@/components/ui/Section";
import { CTAButton } from "@/components/ui/CTAButton";
import { site } from "@/lib/content";

/**
 * PRD §5.1. The page reads as an index: artwork, a statement, the facts, then
 * ruled tables. There are no cards.
 *
 * GROUND. The page is light until the Index, where the curtain wipes it black,
 * and dark from there to the footer. One darkening, in one place, reversing on
 * the way back up.
 *
 * HALO. `halo` names the lane the mark occupies; Section puts the content in
 * the complement, so they can never collide. It alternates right, left, right
 * down the page, appearing once at the statement and leaving once at the index.
 */

const TEASERS = [
  {
    number: "01",
    title: "The theme",
    href: "/about",
    body: "How different knowledges and practices connect and coalesce in advancing social, cultural, and environmental resilience — and how bridging is itself a form of resilience.",
  },
  {
    number: "02",
    title: "The programme",
    href: "/program",
    body: "Keynotes, thematic sessions, eleven working groups, a student symposium, and field visits across Singapore.",
  },
  {
    number: "03",
    title: "Call for abstracts",
    href: "/call-for-abstracts",
    body: "Papers, posters, and panels examining urban and environmental sustainability across the Pacific Rim. Opening soon.",
  },
  {
    number: "04",
    title: "Venue & travel",
    href: "/venue",
    body: "Kent Ridge campus, arrival by air and rail, accommodation near the university, and getting around Singapore.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Home only, and only on a real document load -- see Preloader. */}
      <Preloader />
      <Hero />

      {/*
       * The statement is the display type of the page, set in the serif at the
       * H2 of the scale rather than at a size of its own -- the indent on the
       * second line is what makes it read as a title rather than a heading.
       */}
      <Section id="theme" halo="right">
        <div className="flex flex-col gap-[60rem] max-md:gap-[40rem]">
          <MaskLines
            as="h2"
            className="t-h2"
            lines={[
              "Sustainable",
              <span key="b" className="block pl-[1.6em] max-md:pl-[0.9em]">
                Cities &amp; Landscapes
              </span>,
            ]}
          />
          <Reveal className="flex gap-[20rem] max-md:flex-col max-md:gap-[24rem]">
            <div className="t-b2 rise w-[300rem] max-w-[34ch] max-md:w-full">
              <p>
                Keynotes, thematic sessions, eleven working groups, a student symposium, and field
                visits across Singapore.
              </p>
            </div>
            <div
              className="t-b2 rise w-[300rem] max-w-[34ch] max-md:w-full"
              style={{ transitionDelay: "0.12s" }}
            >
              <p>
                Papers, posters and panels examining urban and environmental sustainability across
                the Pacific Rim.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="facts" halo="left">
        <div className="flex gap-[40rem] max-md:flex-col">
          <Reveal className="w-[300rem] flex-none max-md:w-full">
            <dl className="flex flex-col gap-[34rem] max-md:gap-[26rem]">
              {[
                ["Dates", site.dates],
                ["Location", "Kent Ridge campus, " + site.location],
                ["Host", site.host],
                ["Series", site.seriesName],
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

          {/* Wraps, so it rises rather than being masked — see globals.css. */}
          <Reveal className="flex-1">
            <p className="t-h4 rise">{site.intro}</p>
          </Reveal>
        </div>
      </Section>

      {/* The darkening. 200vh, pinned, black rising from the bottom edge. */}
      <Curtain id="index" label="Index" halo="right">
        <RuleList>
          {TEASERS.map((teaser) => (
            <IndexRow
              key={teaser.href}
              href={teaser.href}
              number={teaser.number}
              title={teaser.title}
              body={teaser.body}
              action="Read"
            />
          ))}
        </RuleList>
      </Curtain>

      <Section id="dates" label="Key dates" ground="dark">
        <ImportantDates />
      </Section>

      {/* Flows straight on from Key dates — one continuous table, one seam. */}
      <Section id="series" label="The series" ground="dark" flow>
        <MaskLines
          as="h3"
          className="t-h2 pb-[80rem] max-md:pb-[40rem]"
          lines={["Ten years across", "the Pacific Rim."]}
        />
        <RuleList>
          {site.priorEditions.map((edition) => (
            <IndexRow
              key={edition.year}
              number={String(edition.edition).padStart(2, "0")}
              title={edition.theme}
              body={edition.host}
              centreBody
              meta={<span className="tnum">{edition.year}</span>}
            />
          ))}
        </RuleList>
      </Section>

      <Section id="join" ground="dark">
        <MaskLines as="h2" className="t-h1" lines={["Join us in", "Singapore, 2027."]} />
        <Reveal className="rise flex flex-wrap gap-[16rem] pt-[60rem] max-md:pt-[40rem]">
          <CTAButton page="home" surface="hero" />
        </Reveal>
      </Section>
    </>
  );
}
