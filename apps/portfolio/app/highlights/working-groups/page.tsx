import Link from "next/link";
import { WorkingGroups } from "@apru/ui";
import { Curtain } from "@/components/motion/Curtain";
import { Reveal } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { forums } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

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
 * GROUND. Light until the curtain, dark from there into the footer. The twelve
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
        {/*
         * Set in the serif rather than the sans: this paragraph is the only body
         * copy on the site that gets a held screen to itself, and the sans reads
         * as a caption at that scale.
         *
         * The SIZE is a constraint, not a preference. `.curtain-pin` is a 100vh
         * box with `overflow: hidden`, so anything taller than the viewport is
         * silently cut off at both ends — at h4 this ran ~780px and was clipped
         * on any 1440x760 laptop. 32 with 1.2 leading holds the whole paragraph
         * inside a 700px viewport. Lengthen this text and check it again.
         */}
        <Reveal className="rise">
          <p className="f-serif dim max-w-[56ch] text-[32rem] leading-[1.2] tracking-[-0.02em]">
            {forums.intro}
          </p>
          {forums.introLink && (
            <p className="t-b1 dim max-w-[70ch] pt-[28rem]">
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
