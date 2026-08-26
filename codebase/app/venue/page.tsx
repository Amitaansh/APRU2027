import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { venue } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Venue and travel",
  description:
    "Attendee information for the 10th APRU-SCL conference: Singapore, the NUS Kent Ridge campus, getting here, accommodation, and entry requirements.",
  path: "/venue",
});

const TBA_NOTES: Record<string, string> = {
  "exact-venue":
    "The exact conference venue within the NUS Kent Ridge campus is being confirmed and will be published here, with room-level detail, ahead of the conference.",
  accommodation:
    "Recommended hotels and any negotiated conference rates are being arranged. Guidance on where to stay, and how to get from each area to campus, will follow.",
};

export default function VenuePage() {
  return (
    <>
      <PageHead
        label="Attendee information"
        title={["Venue", "and travel"]}
        lede="Practical information for getting to Singapore and to the NUS Kent Ridge campus. Sections fill in as arrangements are confirmed."
      />

      <Section label="Getting here">
        <div className="flex flex-col">
          {venue.map((section, i) => (
            <Reveal key={section.id}>
              <div className="rule-solid rule-draw" />
              <div
                className="rise flex gap-[20rem] py-[50rem] max-md:flex-col max-md:gap-[14rem] max-md:py-[34rem]"
                style={{ transitionDelay: Math.min(i * 0.05, 0.3) + "s" }}
              >
                <h2 className="t-h4 w-[380rem] flex-none max-md:w-full">{section.heading}</h2>
                <div className="flex-1">
                  {section.status === "confirmed" ? (
                    <p className="t-b1 dim max-w-[64ch]">{section.body}</p>
                  ) : (
                    <>
                      <p className="t-lbl dim pb-[14rem]">To be announced</p>
                      <p className="t-b2 dim max-w-[60ch]">{TBA_NOTES[section.id]}</p>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal>
            <div className="rule-solid rule-draw" />
          </Reveal>
        </div>

        <p className="t-b2 dim pt-[40rem]">
          Planning around the schedule?{" "}
          <Link href="/program" className="link">
            See the programme outline
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
