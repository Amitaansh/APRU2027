/**
 * Typographic wordmark lockups (PRD §11.3).
 *
 * These are deliberately NOT reconstructions of the official APRU and NUS
 * marks — recreating an institution's logo on their own conference site is a
 * brand-compliance problem. They are set in the site's own display face and
 * read as typesetting, and they are replaced the moment official files arrive.
 */

export function LogoAPRU({ className = "" }: { className?: string }) {
  return (
    <span className={"inline-flex flex-col gap-1 " + className}>
      <span className="font-display text-xl font-black leading-none tracking-[0.02em]">
        APRU
      </span>
      <span className="label-mono text-[0.6rem]">
        Sustainable Cities &amp; Landscapes
      </span>
    </span>
  );
}

export function LogoNUS({ className = "" }: { className?: string }) {
  return (
    <span className={"inline-flex flex-col gap-1 " + className}>
      <span className="font-display text-xl font-black leading-none tracking-[0.02em]">
        NUS
      </span>
      <span className="label-mono text-[0.6rem]">
        Department of Architecture &middot; CDE
      </span>
    </span>
  );
}
