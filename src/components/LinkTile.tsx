// components/LinkTile.tsx
"use client";

import Image from "next/image";
import React from "react";

type Props = {
  href: string;
  label: string;
  icon: string;
};

export function LinkTile({ href, label, icon }: Props) {
  return (
    <a
      href={href}
      className="relative flex items-center group drop-shadow-2xl"
      aria-label={label}
      title={label}
    >
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="transition-all duration-100 ease-in-out cursor-pointer size-16 min-h-16 min-w-16 text-neutral-800 group-hover:text-neutral-700"
      >
        <path
          d="M 0 80 C 0 0, 0 0, 80 0 S 160 0, 160 80, 160 160
80 160, 0 160, 0 80"
        />
      </svg>
      <Image
        src={icon}
        alt={label}
        width={32}
        height={32}
        className="absolute -translate-x-1/2 size-8 left-1/2"
      />
      <span className="absolute text-sm font-medium -translate-x-1/2 -bottom-6 left-1/2 text-nowrap">
        {label}
      </span>
    </a>
  );
}
