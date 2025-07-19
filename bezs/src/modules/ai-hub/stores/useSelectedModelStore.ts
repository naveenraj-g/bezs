import { create } from "zustand";

export type selectedModel = {
  id: string;
  displayName: string | null;
  modelName: string | null;
};

export type TModelPreferences = {
  systemPrompt: string;
  messageLimit: number | "all";
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
};

export type TSelectedModelStore = {
  selectedModel: selectedModel | null;
  setSelectedModel: (selectedModel: selectedModel) => void;
  modelPreferences: TModelPreferences;
  defaultModelPreferences: TModelPreferences;
  setModelPreferences: (preferences: Partial<TModelPreferences>) => void;
};

export const useSelectedModelStore = create<TSelectedModelStore>((set) => {
  return {
    selectedModel: null,
    setSelectedModel(selectedModel) {
      set({ selectedModel });
    },
    modelPreferences: {
      systemPrompt: "You are a helpful assistant.",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1.0,
      topK: 5,
      maxTokens: 1000,
    },
    defaultModelPreferences: {
      systemPrompt: "You are a helpful assistant.",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1.0,
      topK: 5,
      maxTokens: 1000,
    },
    setModelPreferences(preferences) {
      set((state) => ({
        modelPreferences: { ...state.modelPreferences, ...preferences },
      }));
    },
  };
});
