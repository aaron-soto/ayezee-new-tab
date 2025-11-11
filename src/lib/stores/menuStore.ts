import { create } from "zustand";

interface MenuState {
  openMenuId: string | null;
  openMenuType: "hover" | "context" | null;
  setOpenMenu: (id: string | null, type: "hover" | "context" | null) => void;
  closeAllMenus: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  openMenuId: null,
  openMenuType: null,
  setOpenMenu: (id, type) => set({ openMenuId: id, openMenuType: type }),
  closeAllMenus: () => set({ openMenuId: null, openMenuType: null }),
}));
