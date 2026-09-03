import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * The critical component (PRD §6): every unconfirmed area renders this designed
 * state, never a blank region. The wording is meant to read as intentionally
 * early rather than unfinished.
 *
 * Drawn with hairlines and space rather than a dashed box on a tinted panel —
 * a dashed border reads as a placeholder that someone forgot to replace, which
 * is the opposite of the intent.
 */
export function StatusBlock({
  status,
  title,
  note,
  live = false,
  children,
}: {
  status: string;
  title?: ReactNode;
  note?: string;
  /** Marks a state that is actually open. The accent's only job. */
  live?: boolean;
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="rule-solid rule-draw" />
      <div className="rise flex gap-[20rem] py-[50rem] max-md:flex-col max-md:gap-[16rem] max-md:py-[34rem]">
        <p className={"t-lbl w-[180rem] flex-none max-md:w-auto " + (live ? "live" : "dim")}>
          {status}
        </p>
        <div className="flex-1">
          {title && <p className="t-h3">{title}</p>}
          {note && (
            <p className={"t-b2 dim max-w-[56ch] " + (title ? "pt-[24rem]" : "")}>{note}</p>
          )}
          {children && <div className="pt-[36rem]">{children}</div>}
        </div>
      </div>
      <div className="rule-solid rule-draw" />
    </Reveal>
  );
}

export function ToBeAnnounced({
  label = "To be announced",
  note,
}: {
  label?: string;
  note?: string;
  className?: string;
}) {
  return <StatusBlock status="To be announced" title={label} note={note} />;
}

/**
 * The structural placeholder, distinct from ToBeAnnounced on purpose.
 *
 * ToBeAnnounced is a promise to the visitor: this exists and is being
 * confirmed. This one is a note to ourselves — the page is in the sitemap so
 * the structure can be reviewed, and the copy has not been written yet. It
 * reuses StatusBlock so an empty page still arrives with the drawn hairlines
 * and the reveal, rather than reading as a page that failed.
 */
export function Pending({ note }: { note?: string }) {
  return <StatusBlock status="Pending" title="[pending from team]" note={note} />;
}
