import { Reveal } from "./Reveal";
import { IndexRow, RuleList } from "./IndexRow";
import { Portrait } from "./Portrait";
import { ToBeAnnounced } from "./ToBeAnnounced";
import { committee } from "@apru/content";
import type { CommitteeMember } from "@apru/content/types";

/**
 * Organising committee roster (client sitemap). Email addresses are withheld
 * unless committee.showEmails is turned on — enquiries route through the single
 * committee inbox on /contact instead of exposing nine individual addresses.
 *
 * Co-leads get their own ruled rows at display size; the rest of the committee
 * is a column list, which is the right density for a roster of names.
 *
 * Both carry a portrait, graded to match the page by `npm run imagery`: six
 * from the DOA staff directory, three supplied by the committee. A member added
 * without one gets a monogram in the same box, so the grid stays regular either
 * way — see Portrait.tsx.
 *
 * The scientific committee is set differently, as a linked text roster. See the
 * note at that block for why.
 *
 * NAMES ARE LINKS where we have a profile to link to. The client asked for the
 * organising committee to point at the NUS DOA staff directory, which is the
 * authority on how each member is titled — the same argument the scientific
 * roster already makes for linking out. `profileUrl` is optional and a member
 * without one simply renders as text, so the roster never shows a dead link
 * while the remaining URLs are being collected.
 */

/**
 * A member's name, linked to their own profile page where one is published.
 *
 * `.link-run`, not `.link`: two to a row on a phone, a long name wraps, and
 * `.link` is an inline-block that draws one rule the width of the block under
 * its last line. `.link-run` stays inline and rules each line it lands on.
 */
function MemberName({ member }: { member: CommitteeMember }) {
  if (!member.profileUrl) return <>{member.name}</>;
  return (
    <a href={member.profileUrl} target="_blank" rel="noreferrer" className="link-run">
      {member.name}
    </a>
  );
}

/**
 * `leads` decides whether the two co-leads are set apart.
 *
 *   "featured" — their own ruled rows at display size, with portraits. The
 *                portfolio, and how the roster was first designed.
 *   "inline"   — everyone in the one grid, three to a row, in the order the
 *                data gives. The client asked for Jeff and Yun Hye to come
 *                down and join the others, then for the two of them to head
 *                the list, and then -- on the September review -- numbered the
 *                other seven themselves. committee.json now carries that
 *                order, so the grid is the file top to bottom and there is
 *                nothing to lift or sort here.
 *
 * The featured layout still finds the leads by role rather than by position,
 * so it does not depend on the file's order; the seven who follow them come
 * out in the client's order there too.
 *
 * THE LEAD TITLES ARE NOT PRINTED in the inline grid. "Let's remove the title.
 * It seems a bit confused with the affiliation." The other seven keep their
 * conference roles (Open Call Coordination and so on); the roles stay in the
 * data because the featured layout keys off them.
 */
/**
 * The two roles that set a member apart, in the order they are shown. Read as
 * a list rather than as one string because the roster now carries the
 * committee's own role names -- "Lead" and "Co-Lead" -- rather than the single
 * "Co-lead" it started with. A plain equality test against the old value would
 * quietly drop both leads into the grid with everyone else, in alphabetical
 * position.
 */
const LEAD_ROLES = ["Lead", "Co-Lead"];

export function Committee({
  leads: leadStyle = "featured",
}: {
  leads?: "featured" | "inline";
} = {}) {
  if (leadStyle === "inline") return <InlineRoster />;

  const leads = committee.organising
    .filter((m) => LEAD_ROLES.includes(m.role))
    .sort((a, b) => LEAD_ROLES.indexOf(a.role) - LEAD_ROLES.indexOf(b.role));
  const members = committee.organising.filter((m) => !LEAD_ROLES.includes(m.role));

  return (
    <div className="flex flex-col gap-[90rem] max-md:gap-[50rem]">
      {leads.length > 0 && (
        <RuleList>
          {leads.map((member) => (
            <IndexRow
              key={member.name}
              media={<Portrait name={member.name} photo={member.photo} />}
              title={<MemberName member={member} />}
              body={member.affiliation}
              centreBody
              meta={
                committee.showEmails && member.email ? (
                  <a href={"mailto:" + member.email} className="link">
                    {member.email}
                  </a>
                ) : (
                  <span className="dim">{member.role}</span>
                )
              }
            />
          ))}
        </RuleList>
      )}

      <div>
        <p className="t-lbl dim pb-[26rem]">Organising committee</p>
        <Reveal>
          <div className="rule-solid rule-draw" />
          <ul className="grd rise pt-[30rem]">
            {members.map((member) => (
              <li
                key={member.name}
                className="t-b2 flex gap-[16rem] max-md:mb-[18rem]"
                style={{ gridColumn: "span 5" }}
              >
                <span className="w-[110rem] flex-none max-md:w-[86rem]">
                  <Portrait name={member.name} photo={member.photo} />
                </span>
                <span className="flex-1">
                  <span>
                    <MemberName member={member} />
                  </span>
                  <br />
                  <span className="dim">{member.affiliation}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div>
        <p className="t-lbl dim pb-[26rem]">Scientific committee</p>
        {committee.scientificStatus === "tba" || committee.scientific.length === 0 ? (
          <ToBeAnnounced
            label="Scientific committee to be announced"
            note="The scientific committee for the 10th conference is being finalised and will be published here."
          />
        ) : (
          <Reveal>
            <div className="rule-solid rule-draw" />
            {/*
             * No portrait column here, unlike the organising committee. These
             * members sit at eight different institutions and none of them are
             * on the DOA staff directory, so every one would draw a monogram —
             * a grid of nine initials that says nothing. The name carries a link
             * to their own faculty page instead, which is both the authority on
             * how they are titled and the thing a reader actually wants.
             */}
            <ul className="grd rise pt-[30rem]">
              {committee.scientific.map((member) => (
                <li
                  key={member.name}
                  className="t-b2 max-md:mb-[18rem]"
                  style={{ gridColumn: "span 5" }}
                >
                  {member.profileUrl ? (
                    <a
                      href={member.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    >
                      {member.name}
                    </a>
                  ) : (
                    <span>{member.name}</span>
                  )}
                  <br />
                  <span className="dim">{member.affiliation}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/**
 * The client edition's roster: everyone in one grid, three to a row, with the
 * conference role as a third line under the affiliation -- what they are
 * doing for this conference, as distinct from what they are at their
 * university. The two rosters share one grid so they read as one block.
 *
 * TWO TO A ROW ON A PHONE. "One for one row seems a lot scrolled down. Maybe
 * two in one row?" Below 768px `.grd` is a block stack, so the grid is stated
 * again here as two columns; and below `lg` the portrait sits above the text
 * rather than beside it, because half a phone -- or a third of a tablet --
 * is not wide enough for a portrait and a three-line affiliation side by
 * side.
 *
 * Names carry `.person`, the hook the client stylesheet uses to set every
 * name on the site bold and a step up from the lines under it; the names
 * link out through MemberName exactly as before.
 */
function InlineRoster() {
  /* Five of the fifteen columns each -- three to a row -- and one of the two
   * on a phone. A class, not the inline `gridColumn` the featured grid uses:
   * an inline `span 5` cannot be stepped down at a breakpoint. */
  const cell = "col-span-5 max-md:col-span-1";
  const person = "flex gap-[12rem] max-lg:flex-col max-lg:gap-[8rem]";
  const grid =
    "grd gap-y-[24rem] max-md:grid max-md:grid-cols-2 max-md:gap-x-[14rem] max-md:gap-y-[20rem]";

  return (
    <div className="flex flex-col gap-[40rem] max-md:gap-[32rem]">
      <div>
        <p className="t-lbl dim pb-[12rem]">Organising committee</p>
        <Reveal>
          <ul className={grid + " rise"}>
            {committee.organising.map((member) => (
              <li key={member.name} className={cell + " " + person}>
                <span className="w-[110rem] flex-none max-md:w-[96rem]">
                  <Portrait name={member.name} photo={member.photo} />
                </span>
                <span className="t-b2 flex-1">
                  <span className="person block">
                    <MemberName member={member} />
                  </span>
                  <span className="dim block">{member.affiliation}</span>
                  {!LEAD_ROLES.includes(member.role) && (
                    <span className="dim block">{member.role}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div>
        <p className="t-lbl dim pb-[12rem]">Scientific committee</p>
        {committee.scientificStatus === "tba" || committee.scientific.length === 0 ? (
          <ToBeAnnounced
            label="Scientific committee to be announced"
            note="The scientific committee for the 10th conference is being finalised and will be published here."
          />
        ) : (
          <Reveal>
            {/* No portrait column -- see the note on the featured roster. */}
            <ul className={grid + " rise"}>
              {committee.scientific.map((member) => (
                <li key={member.name} className={cell + " t-b2"}>
                  <span className="person block">
                    <MemberName member={member} />
                  </span>
                  <span className="dim block">{member.affiliation}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </div>
  );
}
