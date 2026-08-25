import { FAQAccordion } from "@/components/contact/FAQAccordion";
import { ContactRoute } from "@/components/contact/ContactRoute";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact and FAQ",
  description:
    "Reach the organising committee for the 10th APRU-SCL conference, and answers to common questions about dates, location, abstracts, and registration.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHead
        label="Contact"
        title={["Talk to the", "committee"]}
        lede="Questions about the conference, the working groups, or partnering with us go to the organising committee at the NUS Department of Architecture."
      />

      <Section>
        <ContactRoute />
      </Section>

      <Section label="Questions" ground="dark">
        <FAQAccordion />
      </Section>
    </>
  );
}
