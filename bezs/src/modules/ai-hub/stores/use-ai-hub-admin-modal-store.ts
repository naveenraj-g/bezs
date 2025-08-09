import { create } from "zustand";
import { Assistant, Prompts } from "../../../../prisma/generated/ai-hub";
import { TRolesForAssistant } from "../ui/tables/admin-manage-assistants/admin-manage-assistants-table";

export type ModalType =
  | "addModel"
  | "deleteModel"
  | "addPrompts"
  | "editPrompts"
  | "deletePrompt"
  | "addAssistant"
  | "editAssistant"
  | "deleteAssistant";

type TModelsForAssistantMap = {
  id: string;
  displayName: string | null;
  modelName: string | null;
};

type TAssistantData = Assistant & {
  modelId: string | null;
  accessRoles: TRolesForAssistant;
};

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  id?: string | number;
  promptData?: Prompts | null;
  assistantData?: TAssistantData | null;
  modelsForAssistantMap?: TModelsForAssistantMap[];
  assistantRoles: string[];
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    id?: string | number;
    promptData?: Prompts | null;
    assistantData?: TAssistantData | null;
  }) => void;
  onClose: () => void;
  setModelsForAssistantMapAndRoles: (props: {
    models: TModelsForAssistantMap[];
    roles: string[];
  }) => void;
}

export const useAiHubAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  modelsForAssistantMap: [],
  assistantRoles: [],
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
  setModelsForAssistantMapAndRoles: ({ models = [], roles = [] }) =>
    set({ modelsForAssistantMap: models, assistantRoles: roles }),
}));
