import { FAQAccordion } from "@apru/ui";
import { ContactRoute } from "@apru/ui";
import { Curtain } from "@/components/motion/Curtain";
import { Reveal } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Contact and FAQ",
  description:
    "Reach the organising committee for the 10th APRU-SCL conference, and answers to common questions about dates, location, abstracts, and registration.",
  path: "/contact",
});

/**
 * GROUND. Light until the questions, where the curtain wipes it black, and dark
 * from there into the footer — the home page's construction, one darkening in
 * one place. The accordion sits BELOW the curtain rather than inside it: the
 * curtain's face is a pinned 100vh with `overflow: hidden`, and an answer
 * opening inside that would be clipped.
 *
 * HALO. Two lanes, right then left, so the mark half-turns once on the way
 * through and leaves at the curtain.
 */
export default function ContactPage() {
  return (
    <>
      <PageHead
        label="Contact"
        title={["Talk to the", "committee"]}
        lede="Questions about the conference, the working groups, or partnering with us go to the organising committee at the NUS Department of Architecture."
      />

      <Section halo="right">
        <ContactRoute />
      </Section>

      <Curtain label="Questions" halo="left">
        <Reveal className="rise">
          <p className="t-b1 dim max-w-[70ch]">
            Common questions about the dates, the abstracts, and getting to Singapore. Anything not
            answered here goes to the committee directly.
          </p>
        </Reveal>
      </Curtain>

      <Section ground="dark">
        <FAQAccordion />
      </Section>
    </>
  );
}
