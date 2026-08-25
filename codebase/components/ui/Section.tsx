import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Design Brief §07/03 — mono index + expanded uppercase title on the 12-col
 * grid. Sections breathe at 88px vertical.
 */
export function Section({
  id,
  index,
  title,
  lede,
  children,
  className = "",
  bordered = true,
  level = 2,
}: {
  id?: string;
  index?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  bordered?: boolean;
  /** The first section on a page carries the h1; the rest are h2. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <section
      id={id}
      className={
        (bordered ? "border-t border-line " : "") +
        "py-14 md:py-[88px] " +
        className
      }
    >
      <Container>
        {(index || title) && (
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:gap-5">
            {index && (
              <p className="label-mono md:col-span-2">{index}</p>
            )}
            <div className="md:col-span-10">
              {title && (
                <Heading className="font-display text-[clamp(1.75rem,5vw,3.25rem)] font-black">
                  {title}
                </Heading>
              )}
              {lede && (
                <div className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted md:text-lg">
                  {lede}
                </div>
              )}
            </div>
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
