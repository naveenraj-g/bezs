import { AppType } from "../../../../../prisma/generated/main";

// Users List Table
export type BetterAuthUserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean | null;
  role: string;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  username: string;
  displayUsername: string | null;
};

export interface ManageUsersTableDataType {
  data: BetterAuthUserType[];
  total: number;
  roleData: { name: string }[];
}

// ------------------------------------------------------------------- //

// App List Table
export type AppDataType = {
  _count: {
    appMenuItems: number;
    appActions: number;
  };
  type: AppType;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  description: string;
  imageUrl: string | null;
};

export interface ManageAppsTableDataType {
  data: AppDataType[];
  total: number;
}

// --------------------------------------------------------------------- //

// App Menu Items List Table
export type AppMenuItemsDataType = {
  appId: string;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  description: string;
  icon: string | null;
};

export interface ManageAppMenuItemsTableDataType {
  data: AppMenuItemsDataType[];
  total: number;
}

// --------------------------------------------------------------------------- //

// App Actions List Table
export type AppActionsDataType = {
  appId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  icon: string | null;
  actionName: string;
  actionType: "link" | "button";
};

export interface ManageAppActionsTableDataType {
  data: AppActionsDataType[];
  total: number;
}

// ------------------------------------------------------------------------ //

// RBAC List Table
export type RbacListDataType = {
  user: {
    name: string;
    id: string;
    email: string;
    username: string | null;
  };
  role: {
    name: string;
    id: string;
  };
  organization: {
    name: string;
    id: string;
  };
  userId: string;
  roleId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
};

export interface RbacListTableDataType {
  data: RbacListDataType[];
  total: number;
}
