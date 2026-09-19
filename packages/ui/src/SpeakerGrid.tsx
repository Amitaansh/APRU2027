import { IndexRow, RuleList } from "./IndexRow";
import { Portrait } from "./Portrait";
import { Reveal } from "./Reveal";
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
 * TWO SHAPES. "roster" is the portfolio's: ruled rows, the name as the row's
 * display title, the role and institution in the meta cell at the far end, and
 * a "Keynote" tag in the number column. "profile" is the client's, and it has
 * been through three rounds: first a row with the name at text weight and the
 * affiliation under it ("remove bold for the keynote speaker's name, move their
 * position and institution under their names, remove sub-heading 'keynote'"),
 * then top-aligned so portrait, name and biography start on one edge, and now
 * -- the September review -- a card, two to a row, with the portrait twice the
 * size: "Same font size and style as the other names in the organization page.
 * Better to have 2 in a row. Photo should be double times larger." The card is
 * the review's own sketch: portrait on the left, name over affiliation over
 * biography on the right, the three starting on one edge.
 *
 * A prop rather than a fork, still: both editions read the same data, and the
 * roster rows are untouched.
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

  if (variant === "profile") return <SpeakerCards />;

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
            title={name}
            body={speaker.bio}
            meta={affiliation}
            number={speaker.keynote ? "Keynote" : undefined}
          />
        );
      })}
    </RuleList>
  );
}

/**
 * The client's cards. Two to a row from `lg` up; one below it, because a
 * tablet in portrait gives each card about 340px and a 220rem portrait would
 * leave the biography a column four words wide. The portrait is 220rem --
 * twice the roster's 110 -- and steps down to 120 on a phone, where 220 would
 * be most of the screen.
 *
 * Each card is a two-column grid rather than a flex row, for the phone: the
 * portrait spans both rows on the left with the name block and the biography
 * stacked beside it, and below `md` the biography drops out of that column
 * to run the full width under the portrait. A hundred and fifty words in a
 * 230px column beside a portrait was a card three screens tall -- "make sure
 * it is comfortably read without too much scroll down".
 *
 * `.person` on the name is the same hook the committee rosters carry, so the
 * four names here are set exactly as the eighteen on About -- which is what
 * "same font size and style as the other names" asks for.
 */
function SpeakerCards() {
  return (
    <Reveal>
      <ul className="rise grid grid-cols-2 gap-[40rem] max-lg:grid-cols-1 max-md:gap-[28rem]">
        {speakers.map((speaker) => (
          <li
            key={speaker.id}
            className="grid grid-cols-[220rem_1fr] items-start gap-x-[20rem] max-md:grid-cols-[120rem_1fr] max-md:gap-x-[14rem]"
          >
            <span className="row-span-2 max-md:row-span-1">
              <Portrait name={speaker.name} photo={speaker.photo} />
            </span>
            <div className="t-b2">
              <p className="person">
                {speaker.profileUrl ? (
                  <a href={speaker.profileUrl} target="_blank" rel="noreferrer" className="link-run">
                    {speaker.name}
                  </a>
                ) : (
                  speaker.name
                )}
              </p>
              <p className="pt-[2rem]">{speaker.role + ", " + speaker.institution}</p>
            </div>
            {speaker.bio && (
              <p className="t-b2 pt-[12rem] max-md:col-span-2 max-md:pt-[10rem]">{speaker.bio}</p>
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
