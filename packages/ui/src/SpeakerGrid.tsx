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
 */
export function SpeakerGrid() {
  if (speakers.length === 0) {
    return (
      <ToBeAnnounced
        label="Speakers to be announced"
        note="Keynote and featured speakers for the 10th APRU-SCL conference are being confirmed now. This page will fill as each is announced — register your interest and we will tell you when."
      />
    );
  }

  return (
    <RuleList>
      {speakers.map((speaker) => (
        <IndexRow
          key={speaker.id}
          media={<Portrait name={speaker.name} photo={speaker.photo} />}
          /*
           * The name links out where the speaker has a page of their own, the
           * same way the two committee rosters do. Not `href` on the row: that
           * would make the whole row the link, and the row is mostly a hundred
           * words of biography that nobody is trying to click.
           */
          title={
            speaker.profileUrl ? (
              <a
                href={speaker.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                {speaker.name}
              </a>
            ) : (
              speaker.name
            )
          }
          body={speaker.bio}
          /*
           * Role and institution together. They were the row's title line and
           * its meta column respectively while the roster was a list of names;
           * with the biographies in, the body is the long cell and these two
           * belong to each other rather than at opposite ends of the row.
           */
          meta={speaker.role + ", " + speaker.institution}
          number={speaker.keynote ? "Keynote" : undefined}
        />
      ))}
    </RuleList>
  );
}
