import { PageHead, Reveal, Section, WorkingGroups } from "@apru/ui";
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
      <PageHead label="Highlight" title={["Working Groups"]} />

      <Section>
        <Reveal>
          <p className="t-b1 max-w-[74ch] pb-[54rem] max-md:pb-[34rem]">{forums.intro}</p>
        </Reveal>
        <WorkingGroups swatches={false} />
      </Section>
    </>
  );
}
