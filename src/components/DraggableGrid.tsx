"use client";

import LinkTile, { LinkItem } from "@/components/tiles/LinkTile";

interface DraggableGridProps {
  links: LinkItem[];
}

export default function DraggableGrid({ links }: DraggableGridProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
      {links.map((link, i) => (
        <LinkTile key={link.label + i} link={link} />
      ))}
    </div>
  );
}
