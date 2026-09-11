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
 */

const ADDRESS_LINKS = [
  { label: "Department of Architecture", url: "https://cde.nus.edu.sg/arch/" },
  { label: "College of Design and Engineering", url: "https://cde.nus.edu.sg/" },
  { label: "National University of Singapore", url: "https://nus.edu.sg/" },
];

export function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;

  return (
    <footer className="border-t border-bk/10 pb-[40rem] pt-[70rem] max-md:pb-[28rem] max-md:pt-[44rem]">
      <div className="ctr">
        <div className="grd">
          <div style={{ gridColumn: "span 7" }}>
            {/* Sized off each file's own aspect ratio so the two sit at the
                same cap height rather than the same box height. */}
            <div className="flex flex-wrap items-center gap-x-[28rem] gap-y-[16rem]">
              <img
                src="/images/apru-white.svg"
                alt="APRU"
                width={330}
                height={102}
                className="h-[30rem] w-auto invert"
              />
              <img
                src="/images/nus-doa-white.svg"
                alt="National University of Singapore, Department of Architecture, College of Design and Engineering"
                width={690}
                height={93}
                className="h-[27rem] w-auto invert"
              />
            </div>

            <address className="t-b2 not-italic pt-[24rem] leading-[1.9]">
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
            className="flex flex-col items-start gap-[30rem] max-md:pt-[32rem]"
          >
            <a href={"mailto:" + contactEmail} className="t-b1 link">
              {contactEmail}
            </a>

            <div>
              <p className="t-lbl dim pb-[14rem]">Follow Us</p>
              <Social />
            </div>
          </div>
        </div>

        {/*
         * One sentence, left-aligned, rather than the three columns this used to
         * set across the grid.
         *
         * It does not fit one row on a phone and is not asked to: at 390px, 140
         * characters on a single line works out at about a 5px face. It steps
         * down a size on small screens and wraps.
         */}
        <p className="t-b2 pt-[50rem] max-md:pt-[28rem] max-md:text-[11rem] max-md:leading-[1.7]">
          The 10th APRU Sustainable Cities and Landscapes Conference, {site.dates},{" "}
          {site.location} &copy; National University of Singapore. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
