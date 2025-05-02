import { create } from "zustand";

export type ModalType =
  | "addUser"
  | "editUser"
  | "viewProfile"
  | "deleteUser"
  | "addOrganization"
  | "manageOrgMembers"
  | "manageOrgApps"
  | "editOrg"
  | "deleteOrg"
  | "addRole"
  | "editRole"
  | "deleteRole"
  | "addApp"
  | "editApp"
  | "deleteApp"
  | "addAppMenuItem"
  | "editAppMenuItem"
  | "deleteAppMenuItem"
  | "addAppAction"
  | "editAppAction"
  | "deleteAppAction";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  userId?: string;
  orgId?: string;
  roleId?: string;
  appId?: string;
  appMenuItemId?: string;
  appActionId?: string;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    userId?: string;
    orgId?: string;
    roleId?: string;
    appId?: string;
    appActionId?: string;
    appMenuItemId?: string;
  }) => void;
  onClose: () => void;
}

export const useAdminModal = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    userId = "",
    orgId = "",
    roleId = "",
    appId = "",
    appMenuItemId = "",
    appActionId = "",
  }) =>
    set({
      isOpen: true,
      type,
      userId,
      orgId,
      roleId,
      appId,
      appMenuItemId,
      appActionId,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      userId: "",
      orgId: "",
      roleId: "",
      appId: "",
      appMenuItemId: "",
      appActionId: "",
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

// type - Platform | custom
// actiontype - buttom | link  || icon field

// Roles - menu permission | action permission

// admin menu item - (desc tooltip - Role access control name - RBAC)
// role - app (menu items and action)
// role - org - app
