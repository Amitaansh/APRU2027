import { FAQ, PageHead, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about the 10th APRU-SCL conference in Singapore: participation, abstract submission, Working Groups, registration fees, funding, field trips, the Student Network Session, and visas.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <PageHead label="FAQ" title={["Frequently asked", "questions"]} />

      <Section>
        <FAQ />
      </Section>
    </>
  );
}
