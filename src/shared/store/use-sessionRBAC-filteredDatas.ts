/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";

type RBACSessionFilteredDataStore = {
  rbacSessionData: any[] | null;
  setRBACSessionData: (rbacData: any) => void;
  getRolewiseAppMenuItems: (roleName: string) => void;
};

export const useSessionRBACFilteredData = create<RBACSessionFilteredDataStore>(
  (set) => ({
    rbacSessionData: [],
    setRBACSessionData(userRBACdata) {
      set({ rbacSessionData: userRBACdata });
    },
    getRolewiseAppMenuItems(roleName: string) {
      if (!roleName) return null;

      const roleAppBasedMenuItems = this.rbacSessionData?.reduce(
        (acc, data) => {
          const roleName = data?.role?.name;
          if (!roleName) return acc;

          const orgApps =
            data?.organization?.appOrganization.map((app) => app?.appId) || [];

          const uniqueApps = new Set<string>();

          data?.role?.menuPermission.forEach((menuItem) => {
            const isOrgApp = orgApps.includes(menuItem.app.id);

            if (isOrgApp) {
              uniqueApps.add(menuItem.app.name);
            }
          });

          const uniqueAppsMenuItems = {};

          Array.from(uniqueApps).forEach((app: string) => {
            uniqueAppsMenuItems[app] = [];
          });
        },
        []
      );
    },
  })
);
