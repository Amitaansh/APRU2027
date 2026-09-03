import { ContactRoute, FAQAccordion, PageHead, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Contact and FAQ",
  description:
    "Reach the organising committee for the 10th APRU-SCL conference, and answers to common questions about dates, location, abstracts, and registration.",
  path: "/contact",
});

/**
 * Reachable from the footer rather than from the navigation, at the client
 * request. It is still a real page and still in the sitemap - taking it out of
 * the menu is not the same as taking it off the site, and the FAQ has nowhere
 * else to live.
 */
export default function ContactPage() {
  return (
    <>
      <PageHead label="Contact" title={["Contact"]} />

      <Section>
        <ContactRoute />
      </Section>

      <Section flow>
        <FAQAccordion />
      </Section>
    </>
  );
}
