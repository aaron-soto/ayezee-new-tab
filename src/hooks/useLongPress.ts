import { useCallback, useEffect, useRef, useState } from "react";

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
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setIsPressed(true);
    startTimeRef.current = Date.now();
    onStart?.();

    // Animate progress
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / threshold) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    timerRef.current = setTimeout(() => {
      onLongPress();
    }, threshold);
  }, [onLongPress, onStart, threshold]);

  const cancel = useCallback(() => {
    setIsPressed(false);
    setProgress(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    onCancel?.();
  }, [onCancel]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

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
    progress,
  };
}
