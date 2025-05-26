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
