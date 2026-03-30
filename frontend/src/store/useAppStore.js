import { create } from "zustand";

export const useAppStore = create((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));
