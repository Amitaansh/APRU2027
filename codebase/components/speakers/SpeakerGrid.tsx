import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { speakers } from "@/lib/content";

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
          title={speaker.name}
          body={
            <>
              {speaker.role}
              {speaker.bio ? " — " + speaker.bio : ""}
            </>
          }
          meta={speaker.institution}
          number={speaker.keynote ? "Keynote" : undefined}
        />
      ))}
    </RuleList>
  );
}
