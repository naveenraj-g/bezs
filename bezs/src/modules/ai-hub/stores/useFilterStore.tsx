import { create } from "zustand";

export type TFilterStore = {
  isFilterOpen: boolean;
  open: () => void;
  dismiss: () => void;
  toggleFilter: () => void;
};

export const useFilterStore = create<TFilterStore>((set) => {
  return {
    isFilterOpen: false,
    dismiss() {
      set({ isFilterOpen: false });
    },
    open() {
      set({ isFilterOpen: true });
    },
    toggleFilter() {
      set((state) => ({ isFilterOpen: !state?.isFilterOpen }));
    },
  };
});
