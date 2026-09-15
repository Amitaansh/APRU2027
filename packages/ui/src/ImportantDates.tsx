import { RuleList, IndexRow } from "./IndexRow";
import { dates } from "@apru/content";

const DISPLAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

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
 */
export function ImportantDates({
  through,
  omit = [],
  variant = "rows",
}: { through?: string; omit?: string[]; variant?: "rows" | "lines" } = {}) {
  const rows = (
    through ? dates.filter((row) => row.date !== null && row.date <= through) : dates
  ).filter((row) => !omit.includes(row.id));
  const anyConfirmed = rows.some((row) => row.date !== null && row.id !== "conference");

  const display = (row: (typeof dates)[number]) =>
    row.date ? DISPLAY.format(new Date(row.date + "T00:00:00Z")) : "To be confirmed";

  if (variant === "lines") {
    return (
      <ul className="flex flex-col gap-[14rem]">
        {rows.map((row) => (
          <li key={row.id} className="t-b1">
            {row.label}: <span className={"tnum " + (row.date ? "live" : "dim")}>{display(row)}</span>
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
            meta={<span className={"tnum " + (row.date ? "live" : "dim")}>{display(row)}</span>}
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
