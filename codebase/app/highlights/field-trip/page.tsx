import Link from "next/link";
import { PageHead } from "@/components/ui/PageHead";
import { Pending } from "@/components/ui/ToBeAnnounced";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Field trip",
  description:
    "Field visits across Singapore, run alongside the 10th APRU Sustainable Cities and Landscapes conference, 21-23 May 2027.",
  path: "/highlights/field-trip",
});

export default function FieldTripPage() {
  return (
    <>
      <PageHead
        label="Highlight"
        title={["Field trip"]}
        lede="Site visits across Singapore, run alongside the conference programme."
      />

      <Section halo="right">
        <Pending note="Destinations, dates and capacity for the field visits are being planned by the organising committee." />
        <p className="t-b2 dim pt-[40rem]">
          See the{" "}
          <Link href="/programme" className="link">
            programme outline
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
