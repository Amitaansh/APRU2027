import Link from "next/link";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Key dates",
  description:
    "Abstract deadlines, registration, and the conference dates for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/highlights/key-dates",
});

/**
 * The table's own page, which is what it did not have when it sat on the
 * homepage and on three others besides. Home and Programme link here now;
 * Register and Call for abstracts still show it inline, where a deadline
 * standing next to the action it governs earns its place.
 *
 * The rows are derived from content/phases.ts, so no copy of it can disagree
 * with any other.
 */
export default function KeyDatesPage() {
  return (
    <>
      <PageHead
        label="Highlight"
        title={["Key dates"]}
        lede="Deadlines for the tenth conference, confirmed as each is set."
      />

      <Section halo="right">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          See the{" "}
          <Link href="/programme" className="link">
            programme outline
          </Link>{" "}
          or the{" "}
          <Link href="/call-for-abstracts" className="link">
            call for abstracts
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
