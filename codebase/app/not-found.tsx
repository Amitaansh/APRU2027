import Link from "next/link";
import { CTAButton } from "@/components/ui/CTAButton";
import { Section } from "@/components/ui/Section";

/**
 * A mistyped URL keeps the shell and still converts (App Flow §7.9). Static
 * export writes this to 404.html.
 */
export default function NotFound() {
  return (
    <Section index="§ 404" title="Page not found" level={1}
        bordered={false}>
      <p className="max-w-[52ch] leading-relaxed text-muted">
        That page does not exist. It may have moved, or it may not have been published yet — much of
        this site fills in as the 2027 program is confirmed.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-3 border border-line-strong px-6 py-3.5 font-medium transition-transform duration-[180ms] hover:-translate-y-[3px] hover:border-ink"
        >
          Back to home
        </Link>
        <CTAButton page="other" surface="inline" />
      </div>
    </Section>
  );
}
