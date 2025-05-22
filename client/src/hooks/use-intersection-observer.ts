import { useState, useEffect, RefObject } from "react";

interface IntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useInView(
  elementRef: RefObject<Element>,
  {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
  }: IntersectionOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementInView = entry.isIntersecting;
        setIsInView(isElementInView);

        // If element has been seen and the 'once' option is true,
        // disconnect the observer
        if (isElementInView && once) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, root, rootMargin, threshold, once]);

  return isInView;
}
