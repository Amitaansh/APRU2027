import { Card } from "@/components/ui/Card";
import { CellReveal } from "@/components/ui/Reveal";
import { ToBeAnnounced } from "@/components/ui/ToBeAnnounced";
import { speakers } from "@/lib/content";

/**
 * Empty speakers.json renders the full designed announcement state (App Flow
 * §7.4) — placeholder cells, not an empty page. Confirmed speakers drop into
 * the same grid with no redesign, and promote the page into the navbar.
 */
export function SpeakerGrid() {
  if (speakers.length === 0) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2">
          <ToBeAnnounced
            label="Speakers to be announced"
            note="Keynote and featured speakers for the 10th APRU-SCL conference are being confirmed now. This page will fill as each is announced — register your interest and we will tell you when."
            className="h-full"
          />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <CellReveal key={i} index={i}>
            <div className="flex h-full min-h-[180px] flex-col justify-between border border-line bg-surface p-6">
              <span className="label-mono">
                {"§ 0" + (i + 1)}
              </span>
              <div aria-hidden="true" className="space-y-2">
                <div className="h-2 w-2/3 bg-line" />
                <div className="h-2 w-1/2 bg-line" />
              </div>
            </div>
          </CellReveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {speakers.map((speaker, i) => (
        <CellReveal key={speaker.id} index={i}>
          <Card
            index={speaker.keynote ? "Keynote" : "Speaker"}
            title={speaker.name}
          >
            <p className="text-ink">{speaker.role}</p>
            <p>{speaker.institution}</p>
            {speaker.bio && <p className="mt-4">{speaker.bio}</p>}
          </Card>
        </CellReveal>
      ))}
    </div>
  );
}
