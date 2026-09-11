import { PageHeadArt, Reveal, Section, WorkingGroups } from "@apru/ui";
import { forums } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Working Groups",
  description:
    "The twelve ongoing thematic working groups of the APRU Sustainable Cities and Landscapes network, convening at the 10th conference in Singapore.",
  path: "/highlights/working-groups",
});

/**
 * The client notes on this page, in order: capitalise the G, drop the subtext
 * under the title, remove the red block that repeated the introduction, put the
 * twelve groups on white, and take the coloured dots off.
 *
 * The first four are all absences, so they are simply not written here. The dots
 * are `swatches={false}` - see WorkingGroups for why dropping them costs no
 * information.
 */
export default function WorkingGroupsPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Working Groups"]} />

      <Section>
        {/*
         * The introduction runs to three paragraphs now, and the publications
         * link belongs to the end of the first one — which is where the content
         * document puts it, and why it is set here rather than after the lot.
         */}
        <Reveal>
          <div className="flex max-w-[74ch] flex-col gap-[20rem] pb-[54rem] max-md:pb-[34rem]">
            {forums.intro.map((paragraph, i) => (
              <div key={i} className="contents">
                <p className="t-b1">{paragraph}</p>
                {i === 0 && forums.introLink && (
                  <p className="t-b1">
                    {forums.introLink.lead}{" "}
                    <a
                      href={forums.introLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    >
                      {forums.introLink.label}
                    </a>
                    .
                  </p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
        <WorkingGroups swatches={false} />
      </Section>
    </>
  );
}
