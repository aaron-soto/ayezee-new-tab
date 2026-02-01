"use client";

import Image from "next/image";
import { useRef } from "react";

interface ChildLinkProps {
  child: {
    id?: string;
    href?: string;
    label: string;
    icon: string;
  };
  onLongPress: (
    childId: string,
    childLabel: string,
    element: HTMLAnchorElement,
  ) => void;
  isContextMenuOpen: boolean;
}

export default function ChildLink({
  child,
  onLongPress,
  isContextMenuOpen,
}: ChildLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <a
      ref={linkRef}
      href={child.href}
      className="group/item hover:bg-foreground/10 relative flex items-center overflow-hidden rounded-lg bg-transparent px-2.5 py-2.5 transition active:scale-95"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (linkRef.current) {
          onLongPress(child.id || "", child.label, linkRef.current);
        }
      }}
      onClick={(e) => {
        if (isContextMenuOpen) {
          e.preventDefault();
        }
      }}
    >
      <Image
        src={child.icon}
        alt={child.label}
        width={24}
        height={24}
        className="pointer-events-none relative z-10 ml-0.5 mr-3 size-4"
        draggable={false}
      />
      <span className="relative z-10 text-sm text-neutral-300 transition-colors group-hover/item:text-white">
        {child.label}
      </span>
    </a>
  );
}
