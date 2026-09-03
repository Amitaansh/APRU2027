import Link from "next/link";
import { Reveal } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { venue } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Visitors",
  description:
    "Attendee information for the 10th APRU-SCL conference: the SDE3 venue on the NUS Kent Ridge campus, getting here, getting around Singapore, practicalities, accommodation, and entry requirements.",
  path: "/visitors",
});

/**
 * Renamed from "Visitor resources" to "Visitors" at the client's request.
 *
 * Not a venue page. It answers what a visitor arriving in an unfamiliar city
 * needs — where the rooms are, how the transport works, what the plugs and the
 * weather are like — which is why getting around lives here rather than on a
 * page of its own.
 */
const TBA_NOTES: Record<string, string> = {
  accommodation:
    "Recommended hotels and any negotiated conference rates are being arranged. Guidance on where to stay, and how to get from each area to campus, will follow.",
};

export default function VisitorsPage() {
  return (
    <>
      <PageHead
        label="Attendee information"
        title={["Visitors"]}
        lede="Getting to Singapore, getting around it, and what to expect when you arrive. Sections fill in as arrangements are confirmed."
      />

      <Section label="Your visit">
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
                    <>
                      <p className="t-b1 dim max-w-[64ch]">{section.body}</p>
                      {/*
                       * Resources the prose points at — the campus map, the
                       * ride-hail app. They sit under the paragraph as a row of
                       * links rather than inline, so the copy in venue.json
                       * stays plain text that anyone can edit.
                       */}
                      {section.links?.length ? (
                        <ul className="flex flex-wrap gap-x-[24rem] gap-y-[8rem] pt-[20rem]">
                          {section.links.map((link) => (
                            <li key={link.url}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="t-b2 link"
                              >
                                {link.label}
                                <span aria-hidden="true">&#8202;&#8599;</span>
                                <span className="sr-only">(opens in a new tab)</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
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
          <Link href="/programme/schedule" className="link">
            See the conference schedule
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
