import { Card } from "@/components/ui/Card";
import { CellReveal } from "@/components/ui/Reveal";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { committee } from "@/lib/content";

/**
 * Organising committee roster (client sitemap). Email addresses are withheld
 * unless committee.showEmails is turned on — enquiries route through the single
 * committee inbox on /contact instead of exposing nine individual addresses.
 */
export function Committee() {
  const leads = committee.organising.filter((m) => m.role === "Co-lead");
  const members = committee.organising.filter((m) => m.role !== "Co-lead");

  return (
    <div className="space-y-10">
      <div className="grid gap-5 md:grid-cols-2">
        {leads.map((member, i) => (
          <CellReveal key={member.name} index={i}>
            <Card index="Co-lead" title={member.name}>
              <p>{member.affiliation}</p>
              {committee.showEmails && member.email && (
                <a href={"mailto:" + member.email} className="mt-2 block text-ink hover:text-accent">
                  {member.email}
                </a>
              )}
            </Card>
          </CellReveal>
        ))}
      </div>

      <div>
        <p className="label-mono mb-5">Organising committee</p>
        <ul className="grid gap-x-5 gap-y-4 border-t border-line pt-5 md:grid-cols-3">
          {members.map((member) => (
            <li key={member.name} className="text-base">
              <span className="text-ink">{member.name}</span>
              <br />
              <span className="label-mono">{member.affiliation}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label-mono mb-5">Scientific committee</p>
        {committee.scientificStatus === "tba" || committee.scientific.length === 0 ? (
          <ToBeAnnounced
            label="Scientific committee to be announced"
            note="The scientific committee for the 10th conference is being finalised and will be published here."
          />
        ) : (
          <ul className="grid gap-x-5 gap-y-4 border-t border-line pt-5 md:grid-cols-3">
            {committee.scientific.map((member) => (
              <li key={member.name} className="text-base">
                <span className="text-ink">{member.name}</span>
                <br />
                <span className="label-mono">{member.affiliation}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
