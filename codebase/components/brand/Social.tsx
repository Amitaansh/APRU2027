/**
 * PLACEHOLDERS. The conference has no social accounts yet, so these are drawn
 * but not pointed anywhere — `href="#"` and `aria-disabled`, which is honest
 * about the state rather than shipping four links to nothing.
 *
 * Swap `SOCIALS` for the real handles when they exist; nothing else changes.
 *
 * The glyphs are stroked in `currentColor` at the same 1.5 weight the hamburger
 * and the hairlines take, so they read as part of the rule vocabulary rather
 * than as imported brand assets — the same reasoning as Logos.tsx.
 */

const SOCIALS: { name: string; href: string; path: string }[] = [
  {
    name: "LinkedIn",
    href: "",
    path: "M4.5 6.5h.01M4.5 10v7.5M10 17.5V10m0 0h.01M10 13.2c0-1.8 1-3.2 2.8-3.2s2.7 1.4 2.7 3.2v4.3",
  },
  {
    name: "Instagram",
    href: "",
    path: "M7 3.5h6a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 13V7A3.5 3.5 0 0 1 7 3.5Zm3 3.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm3.9-.7h.01",
  },
];

export function Social({ className = "" }: { className?: string }) {
  return (
    <ul className={"flex items-center gap-[16rem] " + className}>
      {SOCIALS.map((social) => {
        const icon = (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-[20rem]"
          >
            <path d={social.path} />
          </svg>
        );

        return (
          <li key={social.name}>
            {social.href ? (
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="block"
              >
                {icon}
              </a>
            ) : (
              <span
                aria-label={social.name + " — coming soon"}
                aria-disabled="true"
                title={social.name + " — coming soon"}
                className="dim block"
              >
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
