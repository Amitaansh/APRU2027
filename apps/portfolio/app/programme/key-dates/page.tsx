import Link from "next/link";
import { ImportantDates } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Key dates",
  description:
    "Abstract deadlines, registration, and the conference dates for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/programme/key-dates",
});

/**
 * The table's own page, which is what it did not have when it sat on the
 * homepage and on three others besides. It sits under Programme now rather
 * than under Highlight, at the client's request; Register and Call for
 * abstracts still show it inline, where a deadline standing next to the action
 * it governs earns its place.
 *
 * The rows are derived from content/phases.ts, so no copy of it can disagree
 * with any other.
 */
export default function KeyDatesPage() {
  return (
    <>
      <PageHead
        label="Programme"
        title={["Key dates"]}
        lede="Deadlines for the tenth conference, confirmed as each is set."
      />

      <Section halo="right">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          Submitting work? See the{" "}
          <Link href="/call-for-abstracts" className="link">
            call for abstracts
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
