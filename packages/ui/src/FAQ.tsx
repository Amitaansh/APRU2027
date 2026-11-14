import type { ReactNode } from "react";
import { Accordion, type AccordionItem } from "./Accordion";
import { faq, site } from "@apru/content";
import type { FAQBlock } from "@apru/content/types";

/**
 * The FAQ as the client's document sets it (APRU 2027 FAQ.docx, Nov 2026): eight
 * headed groups of questions, numbered straight through from the first to the
 * last, each group running the same fold as Working Groups and Visitors.
 *
 * One Accordion per group, so one answer stays open in each. Answers carry bold
 * phrases, a link, a list and a table, which is why they are blocks in faq.json
 * rather than a single string. See Inline for the small syntax they use.
 */

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

/** `**bold**` and `[label](url)` -- the only two things the document does inline. */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    parts.push(text.slice(last, match.index));
    parts.push(
      match[1] ? (
        <strong key={match.index}>{match[1]}</strong>
      ) : match[3].startsWith("/") ? (
        /* A page of this site, e.g. the Working Groups: same tab. */
        <a key={match.index} href={match[3]} className="link-run">
          {match[2]}
        </a>
      ) : (
        <a key={match.index} href={match[3]} target="_blank" rel="noreferrer" className="link-run">
          {match[2]}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

function FAQAnswer({ blocks }: { blocks: FAQBlock[] }) {
  return (
    <div className="flex flex-col gap-[12rem]">
      {blocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} className="t-b1">
              <Inline text={block} />
            </p>
          );
        }

        if ("list" in block) {
          return (
            <ul key={i} className="flex flex-col gap-[6rem]">
              {block.list.map((entry) => (
                <li key={entry} className="t-b1 flex gap-[14rem]">
                  <span aria-hidden="true" className="dim flex-none">
                    &#8212;
                  </span>
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          /* The same `.fee-table` as Registration, so the two read as one table. */
          <table key={i} className="fee-table t-b1">
            <thead>
              <tr>
                {block.table.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map(([label, ...cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((cell, n) => (
                    <td key={n} className="tnum">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
    </div>
  );
}

export function FAQ() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.contactEmail;
  let asked = 0;

  return (
    <div className="flex flex-col gap-[32rem] max-md:gap-[24rem]">
      {faq.map((group) => {
        const start = asked;
        asked += group.items.length;

        const items: AccordionItem[] = group.items.map((item) => ({
          id: item.id,
          title: item.question,
          children: <FAQAnswer blocks={item.answer} />,
        }));

        return (
          <section key={group.id} aria-labelledby={"faq-" + group.id}>
            <h2 id={"faq-" + group.id} className="t-h3 pb-[8rem]">
              {group.heading}
            </h2>
            <Accordion items={items} start={start} />
          </section>
        );
      })}

      <p className="t-b1">
        For further enquiries, please contact:
        <br />
        <a href={"mailto:" + contactEmail} className="link-run">
          {contactEmail}
        </a>
      </p>
    </div>
  );
}
