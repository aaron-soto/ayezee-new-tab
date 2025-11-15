"use client";

import { SortMode, useSortStore } from "@/lib/stores/sortStore";

export default function SortToggle() {
  const { sortMode, setSortMode } = useSortStore();

  const buttons: { mode: SortMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: "custom",
      label: "Custom Order",
      icon: (
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      mode: "most-visited",
      label: "Most Visited",
      icon: (
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-foreground/5 flex w-full rounded-lg p-1 backdrop-blur-2xl">
      {buttons.map((button) => (
        <button
          key={button.mode}
          type="button"
          onClick={() => setSortMode(button.mode)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-all ${
            sortMode === button.mode
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:text-foreground cursor-pointer"
          }`}
        >
          {button.icon}
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
}
