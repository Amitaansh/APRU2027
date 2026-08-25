import Link from "next/link";
import { RegisterState } from "@/components/register/RegisterState";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ImportantDates } from "@/components/ui/ImportantDates";
import { PageHead } from "@/components/ui/PageHead";
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
    body: "Guided visits to sites across Singapore. Capacity and booking details will follow with the programme.",
  },
];

export default function RegisterPage() {
  return (
    <>
      <PageHead
        label="Register"
        title={["Registration"]}
        lede="Registration is not yet open. This page will carry the link and the rates the moment it is."
      />

      <Section>
        <RegisterState />
      </Section>

      <Section label="Includes" ground="dark">
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
      </Section>

      <Section label="Key dates">
        <ImportantDates />
        <p className="t-b2 dim pt-[40rem]">
          Planning travel?{" "}
          <Link href="/venue" className="link">
            Venue and travel information
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
