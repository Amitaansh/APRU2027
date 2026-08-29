import Link from "next/link";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * A list of rows separated by hairlines, ruled top and bottom.
 *
 * This is the shape almost every list on the site takes -- teasers, prior
 * editions, key dates, working groups, committee members. It replaces the
 * bordered-card grid the old build used everywhere, which is most of what made
 * that build look generic.
 *
 * THE RULES ARE BORDERS, NOT ELEMENTS. They used to be `div.rule-solid` siblings
 * interleaved between the rows, which was simpler to read but cannot survive a
 * row that fills: a standalone hairline is drawn in the *parent's* currentColor,
 * so it would neither invert with the row nor be covered by it, and every filled
 * row would carry a 1px seam above and below it.
 *
 * The list is also the reveal boundary. One observer per list instead of one per
 * row, and each row's `transition-delay` comes from its index, so the rows
 * cascade instead of arriving as a block.
 */
export function RuleList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rows = Children.toArray(children);
  return (
    <Reveal className={"rulelist " + className}>
      {rows.map((row, i) =>
        isValidElement(row)
          ? cloneElement(row as ReactElement<{ index?: number }>, { index: i })
          : row,
      )}
    </Reveal>
  );
}

/**
 * One row. `href` makes the whole row the link -- including its hover sweep, so
 * the target is the row rather than the few words of its title.
 *
 * WHY THE CONTENT IS RENDERED TWICE. On hover the row inverts, and the fill has
 * to sweep across it rather than cross-fade -- which means the type has to change
 * colour as the edge passes it, not all at once. `mix-blend-mode: difference`
 * would do that for free and is the obvious answer, but it is already ruled out
 * on this site for a documented reason (see Curtain.tsx): it inverts every
 * colour, so the accent would come out cyan. Rows carry `.live`, `.dim` and the
 * working-group swatches, so that applies here directly.
 *
 * So the row does what the curtain does: an honest duplicate, rendered in the
 * inverted tokens and revealed by a clip. The duplicate is decorative only --
 * `aria-hidden`, `pointer-events: none` -- and the copy underneath stays the real
 * DOM the whole time, so links, focus rings and screen readers only ever see one
 * row.
 *
 * `swatch` is only used on the Programme page, where the eleven working groups
 * are colour-coded; everywhere else colour stays off the rows.
 */
export function IndexRow({
  href,
  media,
  number,
  title,
  body,
  meta,
  action,
  swatch,
  variant = "display",
  centreBody = false,
  index = 0,
}: {
  href?: string;
  /**
   * A fixed-width block set before the title — a portrait, on the committee
   * roster. It is rendered into the `.idx-veil` duplicate too, like every other
   * cell, so it holds still while the hover fill sweeps past it instead of
   * inverting with the type around it.
   */
  media?: ReactNode;
  number?: string;
  title: ReactNode;
  body?: ReactNode;
  meta?: ReactNode;
  action?: string;
  swatch?: string;
  /** "display" sets the title in the serif; "data" keeps it at text size. */
  variant?: "display" | "data";
  /**
   * Centres the body cell against the title instead of sitting it on the title's
   * first baseline. For lists whose titles run to two or three lines, where the
   * baseline leaves the secondary column stranded at the top of the row.
   *
   * Safe for the hover sweep: `.idx-in` is height-auto, so the flex line's cross
   * size is the title's height in the live row and in the `.idx-veil` duplicate
   * alike, and the centred cell lands on the same pixel in both.
   */
  centreBody?: boolean;
  /** Position in the list, injected by RuleList. Drives the cascade only. */
  index?: number;
}) {
  const titleClass =
    variant === "display" ? "t-h4 w-[420rem] flex-none max-md:w-full" : "t-b1 flex-1";

  const cells = (
    <>
      {media && <span className="w-[110rem] flex-none max-md:w-[86rem]">{media}</span>}
      {swatch && (
        <span
          aria-hidden="true"
          className="mt-[10rem] block size-[10rem] flex-none rounded-full max-md:mt-[6rem]"
          style={{ backgroundColor: swatch }}
        />
      )}
      {number && <span className="t-b2 dim tnum w-[70rem] flex-none max-md:w-auto">{number}</span>}
      <span className={titleClass}>{title}</span>
      {body && (
        <span
          className={
            "t-b2 dim max-w-[60ch] flex-1 max-md:w-full" + (centreBody ? " self-center" : "")
          }
        >
          {body}
        </span>
      )}
      {meta && <span className="t-b2 ml-auto flex-none max-md:ml-0">{meta}</span>}
      {action && (
        <span className="t-b2 ml-auto flex-none self-center max-md:hidden">
          {action} <span className="arw">&rarr;</span>
        </span>
      )}
    </>
  );

  const inner = (
    <>
      <div className="idx-in rise" style={{ transitionDelay: Math.min(index * 0.06, 0.36) + "s" }}>
        {cells}
      </div>
      <div aria-hidden="true" className="idx-veil">
        <div className="idx-in">{cells}</div>
      </div>
    </>
  );

  return href ? (
    <Link href={href} className="idx-row">
      {inner}
    </Link>
  ) : (
    <div className="idx-row">{inner}</div>
  );
}
