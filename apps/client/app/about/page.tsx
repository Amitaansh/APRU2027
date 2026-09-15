import { Committee, PageHeadArt, Reveal, Section, Sponsors } from "@apru/ui";
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
 * The theme statement was here too, as a judgement call — the brief took it off
 * the home page without saying where it should land. The approved content
 * document answers that: it sets those three paragraphs on the home page, under
 * the key visual, and gives About its own opening instead. What this page says
 * now is what APRU-SCL is, and who is hosting the tenth conference.
 *
 * No lede is passed to PageHeadArt: that prop is what sets a paragraph beside the
 * title, and moving it down is precisely the request.
 *
 * The programme link sits on the paragraph's opening phrase, inside the
 * sentence, which is where the content document puts it. It was set as a line
 * of its own under the paragraph, and the client asked for it back in. The
 * phrase is found by matching `aboutLink.label` against the start of the
 * paragraph -- see SiteConfig.aboutLink for why the JSON is not marked up.
 *
 * `band="third"` is the client's sample: one page opening on a third-height
 * band for them to compare against the full-height band everywhere else. It
 * is here and nowhere else until they choose -- see PageHeadArt.
 */
export default function AboutPage() {
  const link = site.aboutLink;
  const linked = link && site.aboutParagraph.startsWith(link.label);

  return (
    <>
      <PageHeadArt label="About" title={["About"]} band="third" />

      <Section>
        <Reveal>
          <div className="t-b1 flex max-w-[74ch] flex-col gap-[24rem]">
            <p>
              {linked ? (
                <>
                  <a href={link.url} target="_blank" rel="noreferrer" className="link">
                    {link.label}
                    <span aria-hidden="true">&#8202;&#8599;</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  {site.aboutParagraph.slice(link.label.length)}
                </>
              ) : (
                site.aboutParagraph
              )}
            </p>
            <p>{site.intro}</p>
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
