import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
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
      <Section
        index="§ Attendee info"
        title="Venue and travel"
        lede="Practical information for getting to Singapore and to the NUS Kent Ridge campus. Sections fill in as arrangements are confirmed."
        level={1}
        bordered={false}
      >
        <div className="grid gap-x-5 gap-y-12 md:grid-cols-12">
          {venue.map((section, i) => (
            <Reveal
              key={section.id}
              delay={i * 0.05}
              className="md:col-span-6"
            >
              <h2 className="font-display text-xl font-bold md:text-2xl">
                {section.heading}
              </h2>
              {section.status === "confirmed" ? (
                <p className="mt-4 max-w-[58ch] leading-relaxed text-muted">
                  {section.body}
                </p>
              ) : (
                <div className="mt-4">
                  <ToBeAnnounced
                    label={section.heading + " to be announced"}
                    note={TBA_NOTES[section.id]}
                  />
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <p className="label-mono mt-14">
          Planning around the schedule?{" "}
          <Link href="/program" className="text-accent hover:underline">
            See the program outline
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
