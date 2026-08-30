import Link from "next/link";
import { WorkingGroups } from "@/components/program/WorkingGroups";
import { Curtain } from "@/components/motion/Curtain";
import { Reveal } from "@/components/motion/Reveal";
import { PageHead } from "@/components/ui/PageHead";
import { Section } from "@/components/ui/Section";
import { forums } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Working groups",
  description:
    "The twelve ongoing thematic working groups of the APRU Sustainable Cities and Landscapes network, convening at the 10th conference in Singapore.",
  path: "/highlights/working-groups",
});

/**
 * Lifted whole from the foot of the Programme page, which was carrying two
 * pages' worth of material. The construction comes with it unchanged.
 *
 * GROUND. Light until the curtain, dark from there into the footer. The eleven
 * groups stay BELOW the curtain, not inside it: the curtain's face is a pinned
 * 100vh with `overflow: hidden`, and an accordion opening inside it would have
 * its answer clipped.
 */
export default function WorkingGroupsPage() {
  return (
    <>
      <PageHead
        label="Highlight"
        title={["Working", "groups"]}
        lede="Twelve ongoing thematic groups convening across the Pacific Rim, each led from a member university."
      />

      {/*
       * The darkening, pinned, black rising from the bottom edge — but shorter
       * here than the 200vh the homepage uses. This curtain carries the
       * introduction rather than a two-word statement, and a full screen of hold
       * after a paragraph someone has just finished reading is a screen of
       * nothing between them and the roster they came for.
       */}
      <Curtain label="Working groups" halo="right" height="130vh">
        <Reveal className="rise">
          <p className="t-b1 dim max-w-[70ch]">{forums.intro}</p>
          {forums.introLink && (
            <p className="t-b1 dim max-w-[70ch] pt-[20rem]">
              {forums.introLink.lead}{" "}
              <a
                href={forums.introLink.url}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                {forums.introLink.label}
              </a>
              .
            </p>
          )}
        </Reveal>
      </Curtain>

      {/*
       * The one page where colour carries information: each working group gets a
       * swatch from a ramp between the halo blue and the key-art orange. The
       * number and the title still identify the group, so the colour is a second
       * channel rather than the only one.
       */}
      <Section ground="dark">
        <WorkingGroups />
        <p className="t-b2 dim pt-[40rem]">
          Details on joining a working group will be published with the full programme.{" "}
          <Link href="/call-for-abstracts" className="link">
            See the call for abstracts
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
