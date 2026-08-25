import type { ReactNode } from "react";

/** Design Brief §02 — 1280px max, 20px gutter. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"mx-auto w-full max-w-[1280px] px-5 md:px-10 " + className}>
      {children}
    </div>
  );
}
