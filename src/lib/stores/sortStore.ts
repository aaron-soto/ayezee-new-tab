import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SortMode = "custom" | "most-visited" | "grid";

interface SortState {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}

export const useSortStore = create<SortState>()(
  persist(
    (set) => ({
      sortMode: "custom",
      setSortMode: (mode) => set({ sortMode: mode }),
    }),
    {
      name: "sort-mode-storage",
    },
  ),
);
