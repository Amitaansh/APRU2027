import type { ReactNode } from "react";

/** Design Brief §07.06 — full-width metadata bar across the 12 columns. */
export function SpreadRow({
  label,
  value,
  meta,
}: {
  label: string;
  value: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="grid items-baseline gap-2 border-t border-line py-5 md:grid-cols-12 md:gap-5">
      <span className="label-mono md:col-span-3">{label}</span>
      <span className="text-base md:col-span-6 md:text-lg">{value}</span>
      {meta && <span className="label-mono md:col-span-3 md:text-right">{meta}</span>}
    </div>
  );
}
