import { PageHeadArt, RegisterState, Section } from "@apru/ui";
import { pageMetadata } from "@apru/content/seo";

export const metadata = pageMetadata({
  title: "Registration",
  description:
    "Registration for the 10th APRU-SCL conference in Singapore opens soon. General and student rates will be published here.",
  path: "/register",
});

/**
 * "Just keep the page empty is fine." The lede, the key dates table and the
 * three-row "Includes" list have all come off; RegisterState is what remains,
 * and it is the one thing on the page that will change by itself when
 * registration opens.
 */
export default function RegisterPage() {
  return (
    <>
      <PageHeadArt label="Registration" title={["Registration"]} />

      <Section>
        <RegisterState />
      </Section>
    </>
  );
}
