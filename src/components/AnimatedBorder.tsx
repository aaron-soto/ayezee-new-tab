"use client";

import { motion } from "framer-motion";

interface AnimatedBorderProps {
  isAnimating: boolean;
  duration?: number; // in seconds
}

export default function AnimatedBorder({
  isAnimating,
  duration = 0.8,
}: AnimatedBorderProps) {
  if (!isAnimating) return null;

  return (
    <motion.div // size-[75px]
      className="pointer-events-none absolute left-1/2 top-1/2 z-[-2] size-[75px] min-h-16 min-w-16 -translate-x-1/2 -translate-y-1/2 rounded-[13px]"
      initial={{
        background:
          "conic-gradient(from 0deg at 50% 50%, #003F5C 0deg, transparent 0deg)",
      }}
      animate={{
        background: [
          "conic-gradient(from 0deg at 50% 50%, #003F5C 0deg, transparent 0deg)",
          "conic-gradient(from 0deg at 50% 50%, #003F5C 360deg, transparent 360deg)",
        ],
      }}
      transition={{
        duration,
        ease: "linear",
      }}
      style={{
        WebkitMaskImage:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "3px",
        filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))",
      }}
    />
  );
}
