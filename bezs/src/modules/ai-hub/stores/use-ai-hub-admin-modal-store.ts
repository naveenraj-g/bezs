import { create } from "zustand";

export type ModalType = "addModel" | "deleteModel";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  modelId?: string;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: { type: ModalType; modelId: string }) => void;
  onClose: () => void;
}

export const useAiHubAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({ type, modelId = "" }) =>
    set({
      isOpen: true,
      type,
      modelId,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      modelId: "",
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));
