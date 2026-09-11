/**
 * PLACEHOLDERS, still. The accounts are reserved as @APRU-SCL2027 but not yet
 * created, so these are drawn and not pointed anywhere — `aria-disabled` and a
 * dimmed glyph, which is honest about the state rather than shipping three links
 * to nothing. Fill `href` in SOCIALS when they exist; nothing else changes.
 *
 * ONE FRAME, THREE GLYPHS. "Same size, now LinkedIn looks smaller, consistent
 * height." It did: the old LinkedIn mark was a bare "in" with no enclosure while
 * Instagram carried a rounded square, so the two were drawn to different optical
 * widths and sat on different baselines. All three are now the same 13x13 rounded
 * square on the same 20x20 field, with the mark inside it — so they are the same
 * size by construction rather than by eye, and adding a fourth means drawing one
 * glyph rather than re-balancing the row.
 *
 * The glyphs are stroked in `currentColor` at the same 1.5 weight the hamburger
 * and the hairlines take, so they read as part of the rule vocabulary rather
 * than as imported brand assets — the same reasoning as Logos.tsx.
 */

/** The enclosure every mark sits in: 3.5 to 16.5 on both axes, 3.5 radius. */
const FRAME =
  "M7 3.5h6a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 13V7A3.5 3.5 0 0 1 7 3.5Z";

const SOCIALS: { name: string; href: string; paths: string[] }[] = [
  {
    name: "LinkedIn",
    href: "",
    paths: [
      FRAME,
      "M7 7.4h.01", // the i's dot
      "M7 9.6v4", // the i's stem
      "M10.2 13.6V9.6", // the n's stem
      "M10.2 11.2c0-1 .65-1.7 1.6-1.7s1.5.7 1.5 1.7v2.4", // the n's shoulder
    ],
  },
  {
    name: "Instagram",
    href: "",
    paths: [
      FRAME,
      "M10 7.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z",
      "M13.9 6.4h.01",
    ],
  },
  {
    name: "Facebook",
    href: "",
    paths: [
      FRAME,
      "M12.1 6.9h-1a1.7 1.7 0 0 0-1.7 1.7v5", // the f's hook and stem
      "M8.2 10.4h3.5", // the crossbar
    ],
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
            {social.paths.map((d) => (
              <path key={d} d={d} />
            ))}
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
