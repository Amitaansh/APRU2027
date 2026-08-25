/**
 * Design Brief §06 — constant-velocity ticker, 26s loop, CSS only (no JS, no
 * library). Pauses entirely under reduced motion via the global guard in
 * globals.css, and is decorative so it is hidden from assistive tech.
 */
export function Marquee({ items }: { items: string[] }) {
  const track = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line bg-surface py-4"
    >
      <div className="marquee-track flex w-max gap-10">
        {track.map((item, i) => (
          <span key={i} className="label-mono whitespace-nowrap text-ink">
            {item}
            <span className="ml-10 text-accent">&#10022;</span>
          </span>
        ))}
      </div>
      <style>{"@keyframes marquee-scroll{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}.marquee-track{animation:marquee-scroll 26s linear infinite}@media (prefers-reduced-motion: reduce){.marquee-track{animation:none}}"}</style>
    </div>
  );
}
