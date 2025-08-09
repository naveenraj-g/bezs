import { create } from "zustand";
import { Assistant } from "../../../../prisma/generated/ai-hub";

type TAssistantStore = {
  assistantsData: Assistant[];
  selectedAssistant: Assistant | null;
  setAssistantsData: (assistants: Assistant[]) => void;
  setSelectedAssistant: (assistant: Assistant | null) => void;
};

export const assistantStore = create<TAssistantStore>((set) => {
  return {
    assistantsData: [],
    selectedAssistant: null,
    setAssistantsData: (assistants) => set({ assistantsData: assistants }),
    setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),
  };
});
