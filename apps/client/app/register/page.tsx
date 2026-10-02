import { PageHeadArt, RegisterState, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Registration",
  description:
    "Registration for the 10th APRU-SCL conference in Singapore opens on 15 January 2027. Standard, Southeast Asian and student rates, with early registration until 28 February 2027.",
  path: "/register",
});

/**
 * "Just keep the page empty is fine." The lede, the key dates table and the
 * three-row "Includes" list have all come off; RegisterState is what remains,
 * and it is the one thing on the page that will change by itself when
 * registration opens.
 *
 * The client's email of 2 Oct 2026 put copy back: who has to register, the
 * fee table, and the date the portal arrives. See `variant` on RegisterState.
 */
export default function RegisterPage() {
  return (
    <>
      <PageHeadArt label="Registration" title={["Registration"]} />

      <Section>
        <RegisterState variant="statement" />
      </Section>
    </>
  );
}
