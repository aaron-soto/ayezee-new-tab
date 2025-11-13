import { create } from "zustand";

interface MenuState {
  openMenuId: string | null;
  openMenuType: "hover" | "context" | null;
  isEditing: boolean;
  setOpenMenu: (id: string | null, type: "hover" | "context" | null) => void;
  closeAllMenus: () => void;
  startEditing: () => void;
  stopEditing: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  openMenuId: null,
  openMenuType: null,
  isEditing: false,
  setOpenMenu: (id, type) => set({ openMenuId: id, openMenuType: type }),
  closeAllMenus: () => set({ openMenuId: null, openMenuType: null }),
  startEditing: () =>
    set({ isEditing: true, openMenuId: null, openMenuType: null }),
  stopEditing: () => set({ isEditing: false }),
}));
