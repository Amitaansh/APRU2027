import { PageHead, Section, ToBeAnnounced } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Students Network Session",
  description:
    "The students network session at the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights/students-network-session",
});

/**
 * Added at the client's request as a title-only page: the session is confirmed
 * as part of the programme, but none of its copy has been written yet.
 *
 * It ships in the sitemap deliberately. The point at this stage is that the
 * team can see the page exists and review the structure around it, which is the
 * same reason the roster pages shipped before their rosters landed.
 */
export default function StudentsNetworkSessionPage() {
  return (
    <>
      <PageHead
        label="Highlight"
        title={["Students", "network", "session"]}
        lede="A dedicated session connecting graduate and doctoral students from across the Pacific Rim network."
      />

      <Section halo="right">
        <ToBeAnnounced
          label="Session details to be announced"
          note="The format, timing and how to take part will be published here alongside the conference programme."
        />
      </Section>
    </>
  );
}
