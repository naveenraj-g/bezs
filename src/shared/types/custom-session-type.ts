import { AppActionType } from "@prisma/client";

export type App = {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppMenuItem = {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  appId: string;
  createdAt: string;
  updatedAt: string;
};

export type AppAction = {
  id: string;
  actionName: string;
  description: string;
  actionType: AppActionType;
  icon: string;
  appId: string;
  createdAt: string;
  updatedAt: string;
};

export type MenuPermission = {
  id: string;
  roleId: string;
  appId: string;
  appMenuItemId: string;
  createdAt: string;
  updatedAt: string;
  app: App;
  appMenuItem: AppMenuItem;
};

export type ActionPermission = {
  roleId: string;
  appId: string;
  appActionId: string;
  app: App;
  appAction: AppAction;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  menuPermission: MenuPermission[];
  actionPermission: ActionPermission[];
};

export type AppOrganization = {
  appId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  app: App;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: unknown; // Use appropriate type if metadata is structured
  appOrganization: AppOrganization[];
};

export type Member = {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  organization: Organization;
  role: Role;
};
