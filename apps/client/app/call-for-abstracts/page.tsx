import { AbstractsState, ImportantDates, PageHeadArt, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Call for Abstracts",
  description:
    "Papers, posters, and panels for the 10th APRU-SCL conference, Singapore 2027. Abstracts are 200 words. The call opens soon.",
  path: "/call-for-abstracts",
});

/**
 * A standalone item in the navigation now - the "Participate" grouping that
 * held this and Registration together is gone.
 *
 * The formats block and the lede have both been removed at the client request,
 * and the key dates are trimmed to the ones that govern a submission: the
 * window, and the notification that closes it. Everything after 15 January is
 * about attending rather than submitting.
 */
export default function CallForAbstractsPage() {
  return (
    <>
      <PageHeadArt label="Call for Abstracts" title={["Call for Abstracts"]} />

      <Section>
        <AbstractsState />
      </Section>

      <Section label="Key Dates" flow>
        <ImportantDates through="2027-01-15" />
      </Section>
    </>
  );
}
