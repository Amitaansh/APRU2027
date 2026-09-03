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
 * Both carry a portrait. Six of the nine are on the DOA staff directory and are
 * graded to match the page by `npm run imagery`; the three who are not get a
 * monogram in the same box, so the grid stays regular either way — see
 * components/ui/Portrait.tsx.
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

/** A member's name, linked to their own profile page where one is published. */
function MemberName({ member }: { member: CommitteeMember }) {
  if (!member.profileUrl) return <>{member.name}</>;
  return (
    <a href={member.profileUrl} target="_blank" rel="noreferrer" className="link">
      {member.name}
    </a>
  );
}

/**
 * `leads` decides whether the two co-leads are set apart.
 *
 *   "featured" — their own ruled rows at display size, with portraits. The
 *                portfolio, and how the roster was first designed.
 *   "inline"   — everyone in the one grid, three to a row. The client asked for
 *                Jeff and Yun Hye to come down and join the others, which is
 *                this: no special case, one list of nine.
 */
export function Committee({
  leads: leadStyle = "featured",
}: {
  leads?: "featured" | "inline";
} = {}) {
  const featureLeads = leadStyle === "featured";
  const leads = featureLeads
    ? committee.organising.filter((m) => m.role === "Co-lead")
    : [];
  const members = featureLeads
    ? committee.organising.filter((m) => m.role !== "Co-lead")
    : committee.organising;

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
                  <span className="dim">Co-lead</span>
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
