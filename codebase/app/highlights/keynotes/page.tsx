import Link from "next/link";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Keynotes",
  description:
    "Keynote and featured speakers for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights/keynotes",
});

/**
 * This is where /speakers went. The two pages were the same page — an empty
 * roster and a programme block with the same subject — and Keynotes is the name
 * the committee uses. SpeakerGrid already renders its own announcement state on
 * an empty speakers.json, so nothing here needs a placeholder of its own.
 */
export default function KeynotesPage() {
  return (
    <>
      <PageHead
        label="Highlight"
        title={["Keynotes"]}
        lede="Keynote and featured speakers, announced as each is confirmed."
      />

      <Section halo="right">
        <SpeakerGrid />
        <p className="t-b2 dim pt-[40rem]">
          See the{" "}
          <Link href="/programme" className="link">
            programme outline
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
