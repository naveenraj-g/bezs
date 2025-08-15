import { create } from "zustand";

export type ModalType =
  | "createCredentials"
  | "editCredentials"
  | "deleteCredentials"
  | "createSettings"
  | "editSettings"
  | "deleteSettings";

interface FileNestAdminStore {
  type: ModalType | null;
  isOpen: boolean;
  id?: number | string;
  data?: any | null;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    id?: number | string;
    data?: any;
  }) => void;
  onClose: () => void;
}

export const useFileNestAdminModal = create<FileNestAdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  onOpen: ({ type, id = "", data = null }) =>
    set({
      isOpen: true,
      type,
      id,
      data,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      id: "",
      data: null,
    }),
}));
