"use client";

export default function AnimatedGradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />

      {/* Animated gradient orbs */}
      <div className="animate-blob absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-purple-900/20 mix-blend-multiply blur-3xl" />
      <div className="animation-delay-2000 animate-blob absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-blue-900/20 mix-blend-multiply blur-3xl" />
      <div className="animation-delay-4000 animate-blob absolute -bottom-1/4 left-1/3 h-[600px] w-[600px] rounded-full bg-indigo-900/20 mix-blend-multiply blur-3xl" />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
        <svg className="h-full w-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </div>
  );
}
