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
 * information. `leadsFirst` is the second round: the leaders' names above each
 * description rather than under it, which is the order the approved content
 * document sets them in. `leadsOneLine` is the third: the names on one line,
 * `Name, Institution; Name, Institution`, exactly as that document writes
 * them, rather than a row for each leader.
 */
export default function WorkingGroupsPage() {
  return (
    <>
      <PageHeadArt label="Highlight" title={["Working Groups"]} />

      <Section>
        {/*
         * The introduction runs to three paragraphs, and the publications link
         * is the last sentence OF the first one — inside the same <p>, not a
         * paragraph of its own. It was set as its own paragraph, and the client
         * asked for it back where the content document has it.
         */}
        <Reveal>
          <div className="flex max-w-[74ch] flex-col gap-[14rem] pb-[28rem] max-md:pb-[20rem]">
            {forums.intro.map((paragraph, i) => (
              <p key={i} className="t-b1">
                {paragraph}
                {i === 0 && forums.introLink && (
                  <>
                    {" "}
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
                  </>
                )}
              </p>
            ))}
          </div>
        </Reveal>
        <WorkingGroups swatches={false} leadsFirst leadsOneLine />
      </Section>
    </>
  );
}
