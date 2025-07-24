"use client";

import { useEffect, useState } from "react";

export function TimeDisplay() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(getFormattedTime());
    update(); // initial call
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Avoid mismatch by rendering nothing at first

  return (
    <span className="text-4xl md:text-7xl font-bold font-mono text-neutral-800 hover:text-neutral-300 transition-colors duration-300 ease-in-out cursor-default">
      {time}
    </span>
  );
}

function getFormattedTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
