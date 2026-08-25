import { RuleList, IndexRow } from "@/components/ui/IndexRow";
import { dates } from "@/lib/content";

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
 */
export function ImportantDates() {
  const anyConfirmed = dates.some((row) => row.date !== null && row.id !== "conference");

  return (
    <div>
      <RuleList>
        {dates.map((row) => (
          <IndexRow
            key={row.id}
            variant="data"
            title={row.label}
            meta={
              <span className={"tnum " + (row.date ? "live" : "dim")}>
                {row.date ? DISPLAY.format(new Date(row.date + "T00:00:00Z")) : "To be confirmed"}
              </span>
            }
          />
        ))}
      </RuleList>
      {!anyConfirmed && (
        <p className="t-b2 dim pt-[24rem]">
          Deadlines are being finalised. Register your interest to be notified as each is confirmed.
        </p>
      )}
    </div>
  );
}
