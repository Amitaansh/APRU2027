import { FAQAccordion } from "@/components/contact/FAQAccordion";
import { ContactRoute } from "@/components/contact/ContactRoute";
import { Reveal } from "@/components/ui/Reveal";
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
      <Section
        index="§ Contact"
        title="Contact"
        lede="Questions about the conference, the working groups, or partnering with us go to the organising committee at the NUS Department of Architecture."
        level={1}
        bordered={false}
      >
        <Reveal>
          <ContactRoute />
        </Reveal>
      </Section>

      <Section index="§ FAQ" title="Frequently asked questions">
        <FAQAccordion />
      </Section>
    </>
  );
}
