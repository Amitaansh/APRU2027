"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";

/**
 * The Design Brief header calls this INVERT. The icon is a stable placeholder
 * until hydration, so the static HTML and the first client render agree.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="label-mono flex items-center gap-2 border border-line-strong px-3 py-2 text-ink transition-colors duration-[180ms] hover:border-ink"
    >
      {hydrated ? (
        isDark ? (
          <Sun aria-hidden="true" className="size-3.5" />
        ) : (
          <Moon aria-hidden="true" className="size-3.5" />
        )
      ) : (
        <span aria-hidden="true" className="size-3.5" />
      )}
      <span className="hidden sm:inline">Invert</span>
    </button>
  );
}
