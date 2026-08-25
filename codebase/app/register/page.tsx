import Link from "next/link";
import { RegisterState } from "@/components/register/RegisterState";
import { Card } from "@/components/ui/Card";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { CellReveal, Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

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
    body: "Guided visits to sites across Singapore. Capacity and booking details will follow with the program.",
  },
];

export default function RegisterPage() {
  return (
    <>
      <Section
        index="§ Register"
        title="Registration"
        lede="Registration is not yet open. This page will carry the link and the rates the moment it is."
        level={1}
        bordered={false}
      >
        <Reveal>
          <RegisterState />
        </Reveal>
      </Section>

      <Section index="§ Includes" title="What registration will include">
        <div className="grid gap-5 md:grid-cols-3">
          {INCLUDES.map((item, i) => (
            <CellReveal key={item.title} index={i}>
              <Card index={"§ 0" + (i + 1)} title={item.title}>
                <p>{item.body}</p>
              </Card>
            </CellReveal>
          ))}
        </div>
        <p className="label-mono mt-8">
          Fees have not been set. No figures are published here until they are confirmed.
        </p>
      </Section>

      <Section index="§ Dates" title="Important dates">
        <Reveal>
          <ImportantDates />
        </Reveal>
        <p className="label-mono mt-8">
          Planning travel?{" "}
          <Link href="/venue" className="text-accent hover:underline">
            Venue and travel information
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
