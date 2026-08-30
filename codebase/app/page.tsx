import { Hero } from "@/components/home/Hero";
import { Curtain } from "@/components/motion/Curtain";
import { Preloader } from "@/components/motion/Preloader";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { CTAButton } from "@/components/ui/CTAButton";
import { site } from "@/lib/content";

/**
 * PRD §5.1. The page reads as an index: artwork, a statement, the facts, then
 * the invitation. There are no cards.
 *
 * WHAT THE PAGE NO LONGER DOES. It used to carry a numbered index of four
 * teasers, the key dates table and the ten-year series list as well — eight
 * sections in all. The index duplicated the navbar, which is the thing visitors
 * already know how to use; key dates has a page of its own under Highlight; and
 * the series sits at the foot of About. What is left is the four things a first
 * visit is for.
 *
 * THE THEME IS THE FIRST THING SAID. It used to have a page of its own, one
 * click away, which is one click too many for the single idea the conference is
 * about. The statement section carries it in full now.
 *
 * GROUND. The page is light until the invitation, where the curtain wipes it
 * black, and dark from there to the footer. One darkening, in one place,
 * reversing on the way back up. It has to happen somewhere: the footer is
 * permanently dark, so a page that ended light would butt onto it at a hard
 * seam.
 *
 * HALO. `halo` names the lane the mark occupies; Section puts the content in
 * the complement, so they can never collide. It alternates right then left, and
 * leaves at the curtain.
 */

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
      <Section id="theme" label="The theme" halo="right">
        <div className="flex flex-col gap-[60rem] max-md:gap-[40rem]">
          <MaskLines
            as="h2"
            className="t-h2"
            lines={[
              "Bridging",
              <span key="b" className="block pl-[1.6em] max-md:pl-[0.9em]">
                Resilience(s)
              </span>,
            ]}
          />

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
                ["Location", site.venueAddress],
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

      {/*
       * The darkening. 200vh, pinned, black rising from the bottom edge — and
       * it is the invitation that carries it now, so the page arrives at the
       * footer already dark.
       */}
      <Curtain id="join" halo="right">
        <MaskLines as="h2" className="t-h1 lh-clear" lines={["Join us in", "Singapore, 2027."]} />
        <Reveal className="rise flex flex-wrap gap-[16rem] pt-[60rem] max-md:pt-[40rem]">
          <CTAButton page="home" surface="hero" />
        </Reveal>
      </Curtain>
    </>
  );
}
