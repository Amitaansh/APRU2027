import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";

/**
 * A mistyped URL keeps the shell and still converts (App Flow §7.9). Static
 * export writes this to 404.html.
 */
export default function NotFound() {
  return (
    <>
      <PageHead
        label="404"
        title={["Page not", "found"]}
        lede="That page does not exist. It may have moved, or it may not have been published yet — much of this site fills in as the 2027 programme is confirmed."
      />

      <Section>
        <Reveal className="rise flex flex-wrap gap-[16rem]">
          <Link href="/" className="btn">
            Back to home
          </Link>
          <CTAButton page="other" surface="inline" variant="secondary" />
        </Reveal>
      </Section>
    </>
  );
}
