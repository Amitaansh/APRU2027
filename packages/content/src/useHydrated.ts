"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True once the client has hydrated, false in the server-rendered HTML.
 *
 * This is the primitive behind the build-time-baseline strategy: components
 * render the statically-correct state first and switch to the live one after
 * hydration, in a single re-render, without a setState-in-effect cascade.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
