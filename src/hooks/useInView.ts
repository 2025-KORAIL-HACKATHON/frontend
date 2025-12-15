"use client";

import { useEffect, useRef, useState } from "react";

type Opts = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useInView<T extends Element>(opts?: Opts) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        root: opts?.root ?? null,
        rootMargin: opts?.rootMargin ?? "0px",
        threshold: opts?.threshold ?? 0.1,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [opts?.root, opts?.rootMargin, opts?.threshold]);

  return { ref, inView };
}
