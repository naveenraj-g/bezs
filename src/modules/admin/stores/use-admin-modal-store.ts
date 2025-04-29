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
  | "deleteRole"
  | "addApp"
  | "editApp"
  | "deleteApp"
  | "manageAppMenuItem"
  | "manageAppPermissions";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  userId?: string;
  orgId?: string;
  roleId?: string;
  appId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    userId?: string;
    orgId?: string;
    roleId?: string;
    appId?: string;
  }) => void;
  onClose: () => void;
}

export const useAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  onOpen: ({ type, userId = "", orgId = "", roleId = "", appId = "" }) =>
    set({ isOpen: true, type, userId, orgId, roleId, appId }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      userId: "",
      orgId: "",
      roleId: "",
      appId: "",
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
}));
