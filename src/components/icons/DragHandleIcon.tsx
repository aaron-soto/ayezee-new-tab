import React from "react";
import { cn } from "@/lib/utils";

function DragHandleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-3", className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8h16M4 16h16"
      />
    </svg>
  );
}

export default DragHandleIcon;
