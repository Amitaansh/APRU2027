/**
 * Typographic wordmark lockups (PRD §11.3).
 *
 * These are deliberately NOT reconstructions of the official APRU and NUS marks
 * — recreating an institution's logo on their own conference site is a
 * brand-compliance problem. They are set in the site's own faces and read as
 * typesetting, and they are replaced the moment official files arrive.
 *
 * The two-voice lockup is the site's signature: the name in the sans, the
 * qualifier in the serif underneath.
 */

export function LogoAPRU({ className = "" }: { className?: string }) {
  return (
    <span className={"inline-flex flex-col " + className}>
      <span className="t-h4 leading-none">APRU</span>
      <span className="t-b2 dim f-serif pt-[8rem]">Sustainable Cities &amp; Landscapes</span>
    </span>
  );
}

export function LogoNUS({ className = "" }: { className?: string }) {
  return (
    <span className={"inline-flex flex-col " + className}>
      <span className="t-h4 leading-none">NUS</span>
      <span className="t-b2 dim f-serif pt-[8rem]">
        Department of Architecture &middot; CDE
      </span>
    </span>
  );
}
