import { create } from "zustand";

export type ModalType =
  | "createCredentials"
  | "editCredentials"
  | "deleteCredentials";

interface FileNestAdminStore {
  type: ModalType | null;
  isOpen: boolean;
  id?: number | string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: { type: ModalType; id?: number | string }) => void;
  onClose: () => void;
}

export const useFileNestUserModal = create<FileNestAdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  onOpen: ({ type, id = "" }) =>
    set({
      isOpen: true,
      type,
      id,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      id: "",
    }),
}));
