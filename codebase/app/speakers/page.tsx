import Link from "next/link";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Speakers",
  description:
    "Keynote and featured speakers for the 10th APRU-SCL conference, Singapore 2027 — to be announced.",
  path: "/speakers",
});

export default function SpeakersPage() {
  return (
    <>
      <PageHead
        label="Speakers"
        title={["Speakers"]}
        lede="Keynote and featured speakers are being confirmed. They will be published here as each is announced."
      />

      <Section>
        <SpeakerGrid />
        <p className="t-b2 dim pt-[40rem]">
          Meanwhile, see the{" "}
          <Link href="/program" className="link">
            programme outline
          </Link>{" "}
          and the eleven working groups.
        </p>
      </Section>
    </>
  );
}
