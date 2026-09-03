import Link from "next/link";
import { RegisterState } from "@apru/ui";
import { Curtain } from "@/components/motion/Curtain";
import { IndexRow, RuleList } from "@apru/ui";
import { ImportantDates } from "@apru/ui";
import { PageHead } from "@apru/ui";
import { Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Register",
  description:
    "Registration for the 10th APRU-SCL conference in Singapore opens soon. General and student rates will be published here.",
  path: "/register",
});

const INCLUDES = [
  {
    title: "Conference access",
    body: "All three days of keynotes, thematic sessions, and working group meetings, 21-23 May 2027.",
  },
  {
    title: "Student rate",
    body: "A reduced rate for graduate and doctoral students, alongside the pre-conference student symposium.",
  },
  {
    title: "Field visits",
    body: "Guided visits to sites across Singapore. Capacity and booking details will follow with the programme.",
  },
];

/**
 * GROUND. Light until Includes, where the curtain wipes it black, and dark from
 * there into the footer -- so what registration buys is the last thing read, on
 * the dark ground, rather than a panel in the middle of the page.
 *
 * Three rows and a line is the most a curtain face will hold: it is a pinned
 * 100vh with `overflow: hidden`.
 *
 * HALO. Right, left, right -- two half turns, leaving at the curtain.
 */
export default function RegisterPage() {
  return (
    <>
      <PageHead
        label="Register"
        title={["Registration"]}
        lede="Registration is not yet open. This page will carry the link and the rates the moment it is."
      />

      <Section halo="right">
        <RegisterState />
      </Section>

      <Section label="Key dates" halo="left">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          Planning travel?{" "}
          <Link href="/visitors" className="link">
            Visitor resources
          </Link>
          .
        </p>
      </Section>

      {/* The darkening. 200vh, pinned, black rising from the bottom edge. */}
      <Curtain label="Includes" halo="right">
        <RuleList>
          {INCLUDES.map((item, i) => (
            <IndexRow
              key={item.title}
              number={String(i + 1).padStart(2, "0")}
              title={item.title}
              body={item.body}
            />
          ))}
        </RuleList>
        <p className="t-b2 dim pt-[40rem]">
          Fees have not been set. No figures are published here until they are confirmed.
        </p>
      </Curtain>
    </>
  );
}
