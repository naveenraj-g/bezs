import { create } from "zustand";

export type ModalType =
  | "addUser"
  | "editUser"
  | "viewProfile"
  | "deleteUser"
  | "addOrganization"
  | "manageOrgMembers"
  | "editOrg"
  | "deleteOrg"
  | "addRole"
  | "editRole"
  | "deleteRole";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  userId?: string;
  orgId?: string;
  roleId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    userId?: string;
    orgId?: string;
    roleId?: string;
  }) => void;
  onClose: () => void;
}

export const useAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  onOpen: ({ type, userId = "", orgId = "", roleId = "" }) =>
    set({ isOpen: true, type, userId, orgId, roleId }),
  onClose: () =>
    set({ type: null, isOpen: false, userId: "", orgId: "", roleId: "" }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
}));
