import Link from "next/link";
import { ImportantDates, PageHeadArt, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Key Dates",
  description:
    "Abstract deadlines, registration, and the conference dates for the 10th APRU Sustainable Cities and Landscapes conference, Singapore, 21-23 May 2027.",
  path: "/programme/key-dates",
});

/**
 * Moved under Programme from Highlight at the client request.
 *
 * The line underneath used to point at the programme outline as well; that page
 * is gone, and the client asked for what remains to be a link to the call for
 * abstracts. The dates themselves are black here rather than accented - see
 * `.live` in globals.css.
 *
 * Everything on the page is at text size: the dates ("1pt smaller than the
 * normal text", so `size="b1"`) and the pointer to the call for abstracts
 * under them ("same font size as above").
 */
export default function KeyDatesPage() {
  return (
    <>
      <PageHeadArt label="Programme" title={["Key Dates"]} />

      <Section>
        <ImportantDates size="b1" />
        <p className="t-b1 pt-[20rem]">
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
