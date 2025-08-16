import { create } from "zustand";
import { TToolKey } from "../hooks/use-tools";

export type selectedModel = {
  id: string | null;
  displayName: string | null;
  modelName: string | null;
  tokens: string | null;
  defaultPrompt?: string;
  messageLimit?: number | "all";
  temperature?: number;
  topP?: number;
  topK?: number;
  maxToken?: number;
  plugins?: TToolKey[];
};

export type TModelPreferences = {
  defaultPrompt: string;
  messageLimit: number | "all";
  temperature: number;
  topP: number;
  topK: number;
  maxToken: number;
  plugins: TToolKey[];
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
    selectedModel: {
      id: null,
      displayName: null,
      modelName: null,
      tokens: null,
      messageLimit: "all",
      plugins: ["calculator", "web_search"],
    },
    setSelectedModel(selectedModel) {
      set((state) => ({
        selectedModel: { ...state.selectedModel, ...selectedModel },
      }));
    },
    modelPreferences: {
      defaultPrompt: "You are a helpful assistant.",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1.0,
      topK: 5,
      maxToken: 1000,
      plugins: ["calculator", "web_search"],
    },
    defaultModelPreferences: {
      defaultPrompt: "You are a helpful assistant.",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1.0,
      topK: 5,
      maxToken: 1000,
      plugins: ["calculator", "web_search"],
    },
    setModelPreferences(preferences) {
      set((state) => ({
        modelPreferences: { ...state.modelPreferences, ...preferences },
      }));
    },
  };
});
