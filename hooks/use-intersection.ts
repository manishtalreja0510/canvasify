"use client";

import { useEffect, useRef, useState } from "react";

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersection<T extends Element>(options: Options = {}) {
  const { threshold = 0.1, root = null, rootMargin = "0%", freezeOnceVisible = true } = options;
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = ref.current;
    if (!node || frozen) return;

    const observer = new IntersectionObserver(
      ([e]) => setEntry(e),
      { threshold, root, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return { ref, entry, isVisible: !!entry?.isIntersecting };
}
