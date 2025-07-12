import { create } from "zustand";

export type selectedModel = {
  id: string;
  displayName: string | null;
  modelName: string | null;
};

export type TSelectedModelStore = {
  selectedModel: selectedModel | null;
  setSelectedModel: (selectedModel: selectedModel) => void;
};

export const useSelectedModelStore = create<TSelectedModelStore>((set) => {
  return {
    selectedModel: null,
    setSelectedModel(selectedModel) {
      set({ selectedModel });
    },
  };
});
