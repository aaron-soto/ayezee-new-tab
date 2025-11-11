import { useCallback, useRef, useState } from "react";

interface UseLongPressOptions {
  onLongPress: () => void;
  onStart?: () => void;
  onCancel?: () => void;
  threshold?: number; // milliseconds
}

export function useLongPress({
  onLongPress,
  onStart,
  onCancel,
  threshold = 800,
}: UseLongPressOptions) {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setIsPressed(true);
    startTimeRef.current = Date.now();
    onStart?.();

    timerRef.current = setTimeout(() => {
      onLongPress();
    }, threshold);
  }, [onLongPress, onStart, threshold]);

  const cancel = useCallback(() => {
    setIsPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onCancel?.();
  }, [onCancel]);

  const handlers = {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchCancel: cancel,
  };

  return {
    handlers,
    isPressed,
    progress: 0, // Will be calculated in component
  };
}
