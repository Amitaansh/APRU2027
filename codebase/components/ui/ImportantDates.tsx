import { dates } from "@/lib/content";

const DISPLAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Rows are derived from content/phases.ts (Backend Schema §4.3) so the table a
 * visitor reads can never disagree with the engine driving the CTAs. A null
 * date renders TBA rather than a gap.
 */
export function ImportantDates() {
  const anyConfirmed = dates.some((row) => row.date !== null && row.id !== "conference");

  return (
    <div>
      <dl className="border-t border-line">
        {dates.map((row) => (
          <div
            key={row.id}
            className="grid items-baseline gap-1 border-b border-line py-5 md:grid-cols-12 md:gap-5"
          >
            <dt className="text-base md:col-span-8 md:text-lg">{row.label}</dt>
            <dd
              className={
                "label-mono md:col-span-4 md:text-right " +
                (row.date ? "text-ink" : "text-accent")
              }
            >
              {row.date ? DISPLAY.format(new Date(row.date + "T00:00:00Z")) : "TBA"}
            </dd>
          </div>
        ))}
      </dl>
      {!anyConfirmed && (
        <p className="label-mono mt-5">
          Deadlines are being finalised. Register your interest to be notified as each is confirmed.
        </p>
      )}
    </div>
  );
}
