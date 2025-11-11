import { useEffect, useRef } from "react";

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * Measure the position of an element and call the callback when it changes
 */
export function useMeasurePosition(update: (position: Position) => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const position: Position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      };
      update(position);
    };

    // Measure on mount
    measure();

    // Remeasure when the window resizes
    window.addEventListener("resize", measure);

    // Use ResizeObserver if available to detect when element size changes
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);

    return () => {
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
    };
  }, [update]);

  return ref;
}
