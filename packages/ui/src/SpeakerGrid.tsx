import { IndexRow, RuleList } from "./IndexRow";
import { Portrait } from "./Portrait";
import { ToBeAnnounced } from "./ToBeAnnounced";
import { speakers } from "@apru/content";

/**
 * Empty speakers.json renders the designed announcement state (App Flow §7.4) —
 * never a blank page. Confirmed speakers drop into ruled rows with no redesign,
 * and promote the page into the navbar.
 *
 * The old build filled the gap with skeleton placeholder cells. Those read as a
 * page that failed to load; a stated "to be announced" reads as a page that is
 * deliberately early, which is the truth.
 *
 * TWO SHAPES OF ROW. "roster" is the portfolio's: the name as the row's display
 * title, the role and institution in the meta cell at the far end, and a
 * "Keynote" tag in the number column. "profile" is what the client asked for on
 * theirs -- "remove bold for the keynote speaker's name, move their position and
 * institution under their names, remove sub-heading 'keynote' next to the
 * headshots" -- and it is also the order the approved content document sets
 * them in: headshot, name, one line of affiliation, biography. A prop rather
 * than a fork, like `swatches` on WorkingGroups: the two editions read the same
 * data through the same row, and disagree only about where two cells go.
 *
 * The profile row is also top-aligned. The list's baseline rule put the name
 * at the foot of the portrait and the biography's first line level with the
 * name; the client's requirement is that the portrait, the name block and the
 * biography start on one edge, with the affiliation under the name. That is
 * `align="start"` on the row -- see IndexRow.
 */
export function SpeakerGrid({ variant = "roster" }: { variant?: "roster" | "profile" } = {}) {
  if (speakers.length === 0) {
    return (
      <ToBeAnnounced
        label="Speakers to be announced"
        note="Keynote and featured speakers for the 10th APRU-SCL conference are being confirmed now. This page will fill as each is announced — register your interest and we will tell you when."
      />
    );
  }

  const profile = variant === "profile";

  return (
    <RuleList>
      {speakers.map((speaker) => {
        /*
         * The name links out where the speaker has a page of their own, the
         * same way the two committee rosters do. Not `href` on the row: that
         * would make the whole row the link, and the row is mostly a hundred
         * words of biography that nobody is trying to click.
         */
        const name = speaker.profileUrl ? (
          <a href={speaker.profileUrl} target="_blank" rel="noreferrer" className="link">
            {speaker.name}
          </a>
        ) : (
          speaker.name
        );

        /*
         * Role and institution together. They were the row's title line and
         * its meta column respectively while the roster was a list of names;
         * with the biographies in, the body is the long cell and these two
         * belong to each other rather than at opposite ends of the row.
         */
        const affiliation = speaker.role + ", " + speaker.institution;

        return (
          <IndexRow
            key={speaker.id}
            media={<Portrait name={speaker.name} photo={speaker.photo} />}
            /*
             * In the profile shape the title cell holds the name AND the
             * affiliation, stacked. `font-normal` is a utility, so it outranks
             * the client stylesheet's `.t-h4 { font-weight: 700 }` in the
             * components layer -- that is the "remove bold"; in the portfolio
             * .t-h4 carries no weight of its own and nothing changes.
             */
            title={
              profile ? (
                <>
                  <span className="block font-normal">{name}</span>
                  <span className="t-b2 block pt-[8rem]">{affiliation}</span>
                </>
              ) : (
                name
              )
            }
            body={speaker.bio}
            meta={profile ? undefined : affiliation}
            number={!profile && speaker.keynote ? "Keynote" : undefined}
            align={profile ? "start" : "baseline"}
          />
        );
      })}
    </RuleList>
  );
}
