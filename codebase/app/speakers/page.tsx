import Link from "next/link";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
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
    <Section
      index="§ Speakers"
      title="Speakers"
      lede="Keynote and featured speakers are being confirmed. They will be published here as each is announced."
      level={1}
        bordered={false}
    >
      <SpeakerGrid />
      <p className="label-mono mt-8">
        Meanwhile, see the{" "}
        <Link href="/program" className="text-accent hover:underline">
          program outline
        </Link>{" "}
        and the eleven working groups.
      </p>
    </Section>
  );
}
