import Link from "next/link";
import { RegisterState } from "@apru/ui";
import { Curtain } from "@/components/motion/Curtain";
import { ImportantDates } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { registration } from "@apru/content";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Register",
  description:
    "Registration for the 10th APRU-SCL conference in Singapore opens on 15 January 2027. General and student rates will be published here.",
  path: "/register",
});

/**
 * GROUND. Light until the curtain wipes it black, and dark from there into the
 * footer -- so the date registration opens is the last thing read, on the dark
 * ground, rather than a panel in the middle of the page.
 *
 * WHAT CAME OUT. The curtain used to carry three "includes" rows -- conference
 * access, a student rate, field visits. They were written for the build, not
 * supplied, and the approved content document does not confirm them: it gives
 * this page one fact, which is the date. Two of the three also named things that
 * are still unconfirmed (a pre-conference student symposium, booking for the
 * visits), so keeping them would have been the site inventing its own programme.
 *
 * HALO. Right, left, right -- two half turns, leaving at the curtain.
 */
export default function RegisterPage() {
  return (
    <>
      <PageHead
        label="Register"
        title={["Registration"]}
        lede="Registration opens on 15 January 2027, and early-bird registration closes on 28 February 2027. This page carries the link and the rates."
      />

      <Section halo="right">
        <RegisterState />
      </Section>

      <Section label="Key dates" halo="left">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          Planning travel?{" "}
          <Link href="/visitors" className="link">
            Visitors
          </Link>
          .
        </p>
      </Section>

      {/* The darkening. 200vh, pinned, black rising from the bottom edge. */}
      <Curtain label="Registration" halo="right">
        <p className="f-serif max-w-[56ch] text-[32rem] leading-[1.2] tracking-[-0.02em]">
          {registration.body}
        </p>
        <p className="t-b2 dim max-w-[56ch] pt-[40rem]">
          Fees have not been set. No figures are published here until they are confirmed, and
          general and student rates will be published together.
        </p>
      </Curtain>
    </>
  );
}
