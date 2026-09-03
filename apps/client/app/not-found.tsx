import Link from "next/link";
import { PageHead, Section } from "@apru/ui";

/** A mistyped URL keeps the shell. Static export writes this to 404.html. */
export default function NotFound() {
  return (
    <>
      <PageHead label="404" title={["Page not found"]} />

      <Section>
        <p className="t-b1 max-w-[60ch]">
          That page does not exist. It may have moved, or it may not have been published yet.
          Much of this site fills in as the 2027 programme is confirmed.
        </p>
        <div className="flex flex-wrap gap-[14rem] pt-[36rem]">
          <Link href="/" className="btn btn-fill">
            Back to home
          </Link>
        </div>
      </Section>
    </>
  );
}
