"use client";

import AddLinkModal from "./AddLinkModal";
import { useState } from "react";

export default function AddLinkButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-all active:scale-95"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add Link</span>
      </button>

      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
