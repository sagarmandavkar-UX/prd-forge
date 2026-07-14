"use client";

import { useEffect } from "react";

export function useDebouncedEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay = 500
) {
  useEffect(() => {
    const handle = window.setTimeout(effect, delay);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
