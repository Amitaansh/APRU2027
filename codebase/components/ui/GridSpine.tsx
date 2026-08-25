/**
 * Design Brief §02 — the visible column spine. Faint verticals signal the
 * 12-column system rather than hiding it. Decorative, so hidden from AT.
 */
export function GridSpine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 mx-auto flex w-full max-w-[1280px] px-5 md:px-10"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1 border-l border-line/40 last:border-r"
        />
      ))}
    </div>
  );
}
