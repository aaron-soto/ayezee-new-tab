// components/FolderTile.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LinkTile } from "./LinkTile";
import type { FolderItem, LinkItem } from "@/lib/nav-types";

type Props = {
  folder: FolderItem;
};

export function FolderTile({ folder }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="relative flex items-center group drop-shadow-2xl"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${folder.label} folder`}
        title={folder.label}
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
          src={folder.icon}
          alt={folder.label}
          width={32}
          height={32}
          className="absolute -translate-x-1/2 size-8 left-1/2"
        />
        <span className="absolute text-sm font-medium -translate-x-1/2 -bottom-6 left-1/2 text-nowrap">
          {folder.label}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${folder.label} links`}
          className="absolute z-50 w-64 p-3 mt-3 -ml-8 border shadow-xl rounded-2xl border-neutral-200 bg-white/95 backdrop-blur"
        >
          <div className="grid grid-cols-3 gap-x-4 gap-y-6">
            {folder.items.map((l: LinkItem) => (
              <LinkTile key={l.label} href={l.href} label={l.label} icon={l.icon} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
