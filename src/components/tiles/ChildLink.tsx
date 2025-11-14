"use client";

import { useLongPress } from "@/hooks/useLongPress";
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

  const childLongPress = useLongPress({
    onLongPress: () => {
      if (linkRef.current) {
        onLongPress(child.id || "", child.label, linkRef.current);
      }
    },
    threshold: 800,
  });

  return (
    <a
      ref={linkRef}
      href={child.href}
      className="group/item hover:bg-foreground/10 relative flex items-center overflow-hidden rounded-lg bg-transparent px-2.5 py-2.5 transition active:scale-95"
      {...childLongPress.handlers}
      onClick={(e) => {
        if (isContextMenuOpen) {
          e.preventDefault();
        }
      }}
    >
      {/* Progress indicator */}
      {childLongPress.isPressed && (
        <div
          className="absolute inset-0 bg-blue-500/30 transition-all"
          style={{
            width: `${childLongPress.progress}%`,
            transition: "width 0.05s linear",
          }}
        />
      )}

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
