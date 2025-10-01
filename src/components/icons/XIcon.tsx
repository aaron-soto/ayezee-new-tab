import React from "react";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.25 1L1.25 12.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 1.25L12.5 12.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default XIcon;
