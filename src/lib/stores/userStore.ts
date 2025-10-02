// lib/stores/userStore.ts

import { create } from "zustand";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  role?: string | undefined;
};

type State = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
