import { create } from "zustand";
import {
  AiModel,
  Assistant,
  ModelSettings,
  Prompts,
} from "../../../../prisma/generated/ai-hub";
import { TRolesForAssistant } from "../ui/tables/admin-manage-assistants/admin-manage-assistants-table";

export type ModalType =
  | "addModel"
  | "editModel"
  | "deleteModel"
  | "addPrompts"
  | "editPrompts"
  | "deletePrompt"
  | "addAssistant"
  | "editAssistant"
  | "deleteAssistant"
  | "knowledge-based"
  | "addModelSettings"
  | "editModelSettings"
  | "deleteModelSettings"
  | "addKnowledgeBased";

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
  modelData?: AiModel | null;
  promptData?: Prompts | null;
  assistantData?: TAssistantData | null;
  modelSettingsData?: ModelSettings | null;
  modelsForAssistantMap?: TModelsForAssistantMap[];
  modelsForSettingsMap?: TModelsForAssistantMap[];
  assistantRoles: string[];
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    id?: string | number;
    modelData?: AiModel | null;
    promptData?: Prompts | null;
    assistantData?: TAssistantData | null;
    modelSettingsData?: ModelSettings | null;
  }) => void;
  onClose: () => void;
  setModelsForAssistantMapAndRoles: (props: {
    models: TModelsForAssistantMap[];
    roles: string[];
  }) => void;
  setModelsForSettings: (props: { models: TModelsForAssistantMap[] }) => void;
}

export const useAiHubAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  modelsForAssistantMap: [],
  assistantRoles: [],
  modelsForSettingsMap: [],
  onOpen: ({
    type,
    id = "",
    modelData = null,
    promptData = null,
    assistantData = null,
    modelSettingsData = null,
  }) =>
    set({
      isOpen: true,
      type,
      id,
      modelData,
      promptData,
      assistantData,
      modelSettingsData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      id: "",
      modelData: null,
      promptData: null,
      assistantData: null,
      modelSettingsData: null,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
  setModelsForAssistantMapAndRoles: ({ models = [], roles = [] }) =>
    set({ modelsForAssistantMap: models, assistantRoles: roles }),
  setModelsForSettings: ({ models }) => set({ modelsForSettingsMap: models }),
}));
