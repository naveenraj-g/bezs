import { create } from "zustand";

export type ModalType = "addUser" | "editUser" | "viewProfile" | "deleteUser";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  userId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (type: ModalType, userId: string) => void;
  onClose: () => void;
}

export const useAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  onOpen: (type, userId = "") => set({ isOpen: true, type, userId }),
  onClose: () => set({ type: null, isOpen: false, userId: "" }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
}));
