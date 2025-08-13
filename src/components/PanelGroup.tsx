// components/PanelGroup.tsx
"use client";

import React, { useEffect, useRef } from "react";
import type { FolderItem, LinkItem, PanelItem } from "@/lib/nav-types";
import { LinkTile } from "./LinkTile";
import { FolderTile } from "./FolderTile";

type Props = {
  panel: PanelItem;
};

export function PanelGroup({ panel }: Props) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (detailsRef.current && typeof panel.initiallyCollapsed === "boolean") {
      detailsRef.current.open = !panel.initiallyCollapsed;
    }
  }, [panel.initiallyCollapsed]);

  return (
    <details ref={detailsRef} className="mb-6 group">
      <summary className="px-4 py-2 text-sm font-semibold list-none border cursor-pointer select-none rounded-xl border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100">
        {panel.title}
        <span className="float-right transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="px-2 pt-4">
        <div className="flex flex-wrap items-center gap-10 gap-y-12">
          {panel.children.map((item) => {
            if (item.type === "link") {
              const l = item as LinkItem;
              return <LinkTile key={l.label} href={l.href} label={l.label} icon={l.icon} />;
            }
            if (item.type === "folder") {
              const f = item as FolderItem;
              return <FolderTile key={f.label} folder={f} />;
            }
            return null;
          })}
        </div>
      </div>
    </details>
  );
}
