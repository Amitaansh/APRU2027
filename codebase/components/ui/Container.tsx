import type { ReactNode } from "react";

/**
 * The page gutter -- 30px at 1920, 15px on mobile.
 *
 * Deliberately not a centred max-width box. Content runs almost to the edge of
 * the viewport and line length is controlled by which of the fifteen columns a
 * block sits in, not by narrowing the page.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={"ctr " + className}>{children}</div>;
}
