import { Social } from "@apru/ui";
import { site } from "@apru/content";

/**
 * "Remove the APRU at the bottom, keep footer simple."
 *
 * The portfolio edition ends every page with four serif capitals running gutter
 * to gutter and the halo turning behind them. This is what is left when that
 * goes: who we are, how to reach us, and one line of small print.
 *
 * It is also light rather than dark. The portfolio's footer is the site's one
 * permanently black surface, which is why every page there has to arrive at it
 * already dark through a curtain. With no curtain in this edition there is
 * nothing to arrive from, and a black band under a white page would be a
 * decorative event on a site that asked for none.
 *
 * THE MARKS ARE THE OFFICIAL FILES NOW, not the typographic stand-ins in
 * Logos.tsx. The designer's package supplies both lockups, and the client asked
 * for APRU, the Department of Architecture and NUS CDE — which is those two
 * files, since the NUS lockup already carries the department and the college
 * beside the shield.
 *
 * They are supplied WHITE, for the key visual, where they sit on the artwork.
 * This footer is a white ground, so they are inverted rather than re-drawn: both
 * files are a single `fill: #fff` throughout, so invert(1) is exactly black and
 * nothing else in them moves. A second, black copy of each file would be two
 * more assets to keep in step with the brand package for no gain.
 *
 * THE ADDRESS IS THE DEPARTMENT'S, not the conference venue's. This is SDE1,
 * where the Department of Architecture sits; the conference itself is in SDE3,
 * which /visitors carries. Both are on Architecture Drive, which is exactly why
 * they are worth keeping apart. The unit number and the switchboard that used to
 * be here are gone: the client set the format for this block line by line, and
 * neither is in it.
 *
 * THE TWO MARKS ARE ONE HEIGHT. They were sized to sit at the same cap height,
 * which put the NUS lockup a hair shorter than the APRU wordmark; the client
 * drew them level -- "NUS logo should be the same size as APRU logo" -- so the
 * boxes are now the same height and the shield stands as tall as the ring.
 *
 * THE SMALL PRINT IS THE COPYRIGHT LINE ALONE. The sentence used to open with
 * the conference name and dates; the client struck that clause. What is left
 * is the notice itself. The location went with the clause: "Singapore (c)
 * National University of Singapore" read as a sentence with a word missing,
 * and the address block above already says where.
 *
 * The social glyphs are the classic filled marks -- "use a more classic
 * icon?" -- see `glyphs` on Social.
 *
 * ON A PHONE THE TWO MARKS SHARE A ROW. At 34rem they measure about 362rem
 * together, more than a phone's measure, so the NUS lockup wrapped under the
 * ring; the client asked for them "in a row" there and only there. 28rem on a
 * 16rem gap is 314rem, and since rem tracks the viewport below `md` that fits
 * at every phone width. The desktop pair is untouched.
 *
 * THE CONTACT BLOCK SITS HARD RIGHT on a wide screen -- "align to far right"
 * -- so the footer reads as two ends, who we are and how to reach us. On a
 * phone it stacks under the address and keeps the left edge.
 */

const ADDRESS_LINKS = [
  { label: "Department of Architecture", url: "https://cde.nus.edu.sg/arch/" },
  { label: "College of Design and Engineering", url: "https://cde.nus.edu.sg/" },
  { label: "National University of Singapore", url: "https://nus.edu.sg/" },
];

export function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;

  return (
    <footer className="border-t border-bk/10 pb-[32rem] pt-[40rem] max-md:pb-[24rem] max-md:pt-[28rem]">
      <div className="ctr">
        <div className="grd">
          <div style={{ gridColumn: "span 7" }}>
            <div className="flex flex-wrap items-center gap-x-[24rem] gap-y-[12rem] max-md:flex-nowrap max-md:gap-x-[16rem]">
              <img
                src="/images/apru-white.svg"
                alt="APRU"
                width={330}
                height={102}
                className="h-[34rem] w-auto invert max-md:h-[28rem]"
              />
              <img
                src="/images/nus-doa-white.svg"
                alt="National University of Singapore, Department of Architecture, College of Design and Engineering"
                width={690}
                height={93}
                className="h-[34rem] w-auto invert max-md:h-[28rem]"
              />
            </div>

            <address className="t-b2 not-italic pt-[16rem] leading-[1.6]">
              {ADDRESS_LINKS.map((line) => (
                <span key={line.url} className="block">
                  <a href={line.url} target="_blank" rel="noreferrer" className="link">
                    {line.label}
                  </a>
                </span>
              ))}
              4 Architecture Drive
              <br />
              {/* No thin space in the postcode — the client set it closed up. */}
              Singapore 117566
            </address>
          </div>

          {/*
           * The email is the site's contact affordance. "Contact and FAQ" was
           * here beside it and came out at the client's request.
           */}
          <div
            style={{ gridColumn: "10 / span 6" }}
            className="flex flex-col items-start gap-[20rem] max-md:pt-[24rem] md:items-end md:text-right"
          >
            <a href={"mailto:" + contactEmail} className="t-b1 link">
              {contactEmail}
            </a>

            <div>
              <p className="t-lbl dim pb-[8rem]">Follow Us</p>
              <Social glyphs="classic" className="md:justify-end" />
            </div>
          </div>
        </div>

        {/* One line, left-aligned, rather than the three columns this used to
            set across the grid. */}
        <p className="t-b2 pt-[32rem] max-md:pt-[24rem]">
          &copy; National University of Singapore. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
