"use client";

import { SortMode, useSortStore } from "@/lib/stores/sortStore";
import { useEffect, useRef, useState } from "react";

export default function SortSelect() {
  const { sortMode, setSortMode } = useSortStore();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const options: {
    value: SortMode;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "custom",
      label: "Custom Order",
      description: "Manually arrange your links",
      icon: (
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      value: "most-visited",
      label: "Most Visited",
      description: "Sort by click count",
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      value: "grid",
      label: "Free Grid",
      description: "Place links anywhere on the grid",
      icon: (
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
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
      ),
    },
  ];

  const selectedOption =
    options.find((opt) => opt.value === sortMode) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-foreground/5 hover:bg-foreground/10 flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left backdrop-blur-2xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-foreground">{selectedOption.icon}</div>
          <div>
            <div className="text-foreground text-sm font-medium">
              {selectedOption.label}
            </div>
          </div>
        </div>
        <svg
          className={`text-muted-foreground h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="bg-surface absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg shadow-xl backdrop-blur-2xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSortMode(option.value);
                setIsOpen(false);
              }}
              className={`hover:bg-surface-hover flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left transition-colors ${
                sortMode === option.value ? "bg-surface-hover" : ""
              }`}
            >
              <div
                className={
                  sortMode === option.value
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${sortMode === option.value ? "text-foreground" : "text-neutral-300"}`}
                >
                  {option.label}
                </div>
                <div className="text-muted-foreground text-xs">
                  {option.description}
                </div>
              </div>
              {sortMode === option.value && (
                <svg
                  className="text-foreground h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
