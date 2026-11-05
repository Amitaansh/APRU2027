import Link from "next/link";
import { ContactRoute, PageHeadArt, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Reach the organising committee for the 10th APRU-SCL conference.",
  path: "/contact",
});

/**
 * Out of the navigation at the client request, but still a real page and still
 * in the sitemap. The questions that used to sit under it have their own page
 * and nav item now, at /faq.
 */
export default function ContactPage() {
  return (
    <>
      <PageHeadArt label="Contact" title={["Contact"]} />

      <Section>
        <ContactRoute />
        <p className="t-b1 pt-[20rem]">
          Have a question? See the{" "}
          <Link href="/faq" className="link">
            FAQ
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
