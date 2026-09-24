import { RuleList, IndexRow } from "./IndexRow";
import { dates } from "@apru/content";

const DISPLAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: "UTC" });

const utc = (iso: string) => new Date(iso + "T00:00:00Z");

/**
 * "15 November 2026", "21—23 May 2027", "15 November 2026 (UTC+8)".
 *
 * A span within one month shares its month and year across the dash, which is
 * how the client wrote the conference row; one that crosses a month sets both
 * ends in full. The dash is the EM dash `site.dates` carries, so the hero, the
 * footer and this table all say the conference the same way — not the en dash
 * `formatRange` would pick, which would be the one place the site differs.
 *
 * The note is the timezone a deadline is kept in. It sits with the date rather
 * than in the label — "Abstract submission deadline" is the fact, "(UTC+8)" is
 * a qualifier on when it falls — and it takes the date's own style, because
 * the deadline is the whole string, not the day alone.
 */
function display(row: (typeof dates)[number]): string {
  if (!row.date) return "To be confirmed";
  const start = utc(row.date);
  let text = DISPLAY.format(start);
  if (row.dateEnd) {
    const end = utc(row.dateEnd);
    const sameMonth =
      start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth();
    text = (sameMonth ? DAY.format(start) : text) + "—" + DISPLAY.format(end);
  }
  return row.note ? text + " (" + row.note + ")" : text;
}

/**
 * Rows are derived from content/phases.ts (Backend Schema §4.3) so the table a
 * visitor reads can never disagree with the engine driving the CTAs. A null date
 * renders "To be confirmed" rather than a gap.
 *
 * `.live` marks the one row that is actually settled. That is the accent's only
 * job on the whole site, so a confirmed date is the single coloured word on the
 * page — which is what makes it read as information rather than decoration.
 *
 * `through` trims the table to the deadlines that govern one action. Call for
 * abstracts shows the submission window and the notification and stops there:
 * registration and early-bird are real dates, but they are not what a visitor
 * on that page is deciding about. An unset date is never in scope for a cut-off
 * — there is nothing to compare it against. `omit` drops named rows from
 * inside that range, for a page whose source lists the early-bird deadline but
 * not the day registration opens.
 *
 * `variant="lines"` sets the same rows as "label: date" lines in running text
 * instead of ruled rows across the measure. That is how the content document
 * writes the dates inside the call for abstracts, and the client edition sets
 * that page as the document has it.
 *
 * `size` is the date cell's type size in the ruled rows. IndexRow sets its
 * meta cell a step under the label, which is right for a quiet qualifier and
 * wrong for the fact the row exists to give: the client read the bold dates
 * as "1pt smaller than the normal text" and asked for them up. "b1" sets them
 * at the label's size; the portfolio keeps the default.
 */
export function ImportantDates({
  through,
  omit = [],
  variant = "rows",
  size = "b2",
}: {
  through?: string;
  omit?: string[];
  variant?: "rows" | "lines";
  size?: "b1" | "b2";
} = {}) {
  const rows = (
    through ? dates.filter((row) => row.date !== null && row.date <= through) : dates
  ).filter((row) => !omit.includes(row.id));
  const anyConfirmed = rows.some((row) => row.date !== null && row.id !== "conference");

  if (variant === "lines") {
    /*
     * The same drawn dash the submission requirements under it carry, so the
     * two lists on the call for abstracts are set one way -- "please be
     * consistent if bullet point start with '-' or without".
     */
    return (
      <ul className="flex flex-col gap-[6rem]">
        {rows.map((row) => (
          <li key={row.id} className="t-b1 flex gap-[14rem]">
            <span aria-hidden="true" className="dim flex-none">
              &#8212;
            </span>
            <span>
              {row.label}:{" "}
              <span className={"tnum " + (row.date ? "live" : "dim")}>{display(row)}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <RuleList>
        {rows.map((row) => (
          <IndexRow
            key={row.id}
            variant="data"
            title={row.label}
            meta={
              /* The size on a wrapper of its own: `.t-b1` also sets weight 400,
                 and on the same element it would take the bold off `.live`. */
              <span className={size === "b1" ? "t-b1" : undefined}>
                <span className={"tnum " + (row.date ? "live" : "dim")}>{display(row)}</span>
              </span>
            }
          />
        ))}
      </RuleList>
      {!anyConfirmed && (
        <p className="t-b2 dim pt-[24rem]">
          Deadlines are being finalised and will be published here as each is confirmed.
        </p>
      )}
    </div>
  );
}
