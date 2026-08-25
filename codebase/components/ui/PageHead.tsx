import type { ReactNode } from "react";
import { MaskLines, Reveal } from "@/components/motion/Reveal";

/**
 * How every page other than the homepage opens.
 *
 * The top padding clears the fixed header, which is three lines of wordmark
 * deep and has no background to push content down with. The title is authored
 * as separate lines because each one becomes its own mask — see MaskLines.
 *
 * The lede sits in the right-hand columns rather than under the title, so the
 * opening reads as a spread rather than as a stacked header.
 */
export function PageHead({
  label,
  title,
  lede,
}: {
  label: string;
  title: string[];
  lede?: ReactNode;
}) {
  return (
    <section className="pb-[140rem] pt-[240rem] max-md:pb-[60rem] max-md:pt-[130rem]">
      <div className="ctr">
        <Reveal className="rise pb-[40rem] max-md:pb-[24rem]">
          <p className="t-lbl dim">{label}</p>
        </Reveal>
        <div className="grd">
          <div style={{ gridColumn: "1 / span 9" }}>
            <MaskLines as="h1" immediate className="t-h1" lines={title} />
          </div>
          {lede && (
            <div style={{ gridColumn: "11 / span 5" }} className="max-md:mt-[40rem]">
              <Reveal>
                <div className="t-b1 rise max-w-[46ch]">{lede}</div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
