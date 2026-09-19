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
 *
 * TWO SETS OF GLYPHS. The stroked set above is the portfolio's. The client
 * looked at them and asked, "Use a more classic icon?", pointing at the filled
 * marks everyone recognises -- so `glyphs="classic"` draws those instead: the
 * three brand glyphs from Bootstrap Icons (MIT), filled in `currentColor` on
 * the same 20rem field. The networks, the order, the disabled state and the
 * labels are identical between the two sets; only the drawing changes.
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

/**
 * The classic marks, keyed by the same names. Bootstrap Icons v1 `linkedin`,
 * `instagram` and `facebook`, on their own 16x16 box; each is one filled path.
 */
const CLASSIC: Record<string, string> = {
  LinkedIn:
    "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  Instagram:
    "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334",
  Facebook:
    "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951",
};

export function Social({
  className = "",
  glyphs = "line",
}: {
  className?: string;
  /** "line" is the stroked set drawn above; "classic" the filled brand marks. */
  glyphs?: "line" | "classic";
}) {
  return (
    <ul className={"flex items-center gap-[16rem] " + className}>
      {SOCIALS.map((social) => {
        const icon =
          glyphs === "classic" ? (
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="size-[20rem]">
              <path d={CLASSIC[social.name]} />
            </svg>
          ) : (
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
