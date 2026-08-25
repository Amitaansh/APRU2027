import type { ReactNode } from "react";

/**
 * Design Brief §07.04 — bordered modular cell with a mono corner index.
 * Hairline borders carry the structure; no shadows.
 */
export function Card({
  index,
  title,
  children,
  className = "",
  status,
}: {
  index?: string;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  status?: string;
}) {
  return (
    <article
      className={
        "flex h-full flex-col gap-4 border border-line bg-surface p-6 md:p-8 " +
        className
      }
    >
      {(index || status) && (
        <div className="flex items-baseline justify-between gap-4">
          {index && <span className="label-mono">{index}</span>}
          {status && <span className="label-mono text-accent">{status}</span>}
        </div>
      )}
      {title && (
        <h3 className="font-display text-lg font-bold leading-tight md:text-xl">
          {title}
        </h3>
      )}
      {children && (
        <div className="text-sm leading-relaxed text-muted">{children}</div>
      )}
    </article>
  );
}
