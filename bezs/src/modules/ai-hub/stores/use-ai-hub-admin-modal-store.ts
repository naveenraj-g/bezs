import { create } from "zustand";
import { Assistant, Prompts } from "../../../../prisma/generated/ai-hub";

export type ModalType =
  | "addModel"
  | "deleteModel"
  | "addPrompts"
  | "editPrompts"
  | "deletePrompt"
  | "addAssistant"
  | "editAssistant"
  | "deleteAssistant";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  id?: string | number;
  promptData?: Prompts | null;
  assistantData?: Assistant | null;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    id?: string | number;
    promptData?: Prompts | null;
    assistantData?: Assistant | null;
  }) => void;
  onClose: () => void;
}

export const useAiHubAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({ type, id = "", promptData = null, assistantData = null }) =>
    set({
      isOpen: true,
      type,
      id,
      promptData,
      assistantData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      id: "",
      promptData: null,
      assistantData: null,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));
