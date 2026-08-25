import { Reveal } from "@/components/motion/Reveal";
import { IndexRow, RuleList } from "@/components/ui/IndexRow";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { committee } from "@/lib/content";

/**
 * Organising committee roster (client sitemap). Email addresses are withheld
 * unless committee.showEmails is turned on — enquiries route through the single
 * committee inbox on /contact instead of exposing nine individual addresses.
 *
 * Co-leads get their own ruled rows at display size; the rest of the committee
 * is a column list, which is the right density for a roster of names.
 */
export function Committee() {
  const leads = committee.organising.filter((m) => m.role === "Co-lead");
  const members = committee.organising.filter((m) => m.role !== "Co-lead");

  return (
    <div className="flex flex-col gap-[90rem] max-md:gap-[50rem]">
      <RuleList>
        {leads.map((member) => (
          <IndexRow
            key={member.name}
            title={member.name}
            body={member.affiliation}
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

      <div>
        <p className="t-lbl dim pb-[26rem]">Organising committee</p>
        <div className="rule-solid" />
        <Reveal>
          <ul className="grd rise pt-[30rem]">
            {members.map((member) => (
              <li
                key={member.name}
                className="t-b2 max-md:mb-[18rem]"
                style={{ gridColumn: "span 5" }}
              >
                <span>{member.name}</span>
                <br />
                <span className="dim">{member.affiliation}</span>
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
          <>
            <div className="rule-solid" />
            <Reveal>
              <ul className="grd rise pt-[30rem]">
                {committee.scientific.map((member) => (
                  <li
                    key={member.name}
                    className="t-b2 max-md:mb-[18rem]"
                    style={{ gridColumn: "span 5" }}
                  >
                    <span>{member.name}</span>
                    <br />
                    <span className="dim">{member.affiliation}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
