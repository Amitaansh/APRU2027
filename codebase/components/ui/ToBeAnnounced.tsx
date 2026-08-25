/**
 * The critical component (PRD §6, Design Brief §07.05): every unconfirmed area
 * renders this designed state, never a blank region. The wording is meant to
 * read as intentionally early rather than unfinished.
 */
export function ToBeAnnounced({
  label = "To be announced",
  note,
  className = "",
}: {
  label?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={
        "flex flex-col gap-3 border border-dashed border-line-strong bg-surface px-6 py-10 " +
        className
      }
    >
      <p className="label-mono text-accent">§ TBA</p>
      <p className="font-display text-xl font-bold text-ink md:text-2xl">
        {label}
      </p>
      {note && <p className="max-w-[52ch] text-sm leading-relaxed text-muted">{note}</p>}
    </div>
  );
}
