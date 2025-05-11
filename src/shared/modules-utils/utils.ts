/* eslint-disable @typescript-eslint/no-explicit-any */
export function getRolewiseAppMenuItems(rbacSessionData: any, appName: string) {
  if (!appName || !rbacSessionData) return null;

  const orgApps = new Set(
    rbacSessionData.flatMap(
      (data) =>
        data?.organization?.appOrganization.map((app) => app?.appId) || []
    )
  );

  const uniqueApps = new Set();

  rbacSessionData.forEach((data) => {
    data?.role?.menuPermission.forEach((menuItem) => {
      const appName = menuItem.app.slug.split("/").pop();
      const isOrgApp = orgApps.has(menuItem.app.id);

      if (isOrgApp) {
        uniqueApps.add(appName);
      }
    });
  });

  const uniqueAppsMenuItems = {};

  uniqueApps.forEach((app: string) => {
    uniqueAppsMenuItems[app] = [];
  });

  rbacSessionData?.forEach((data) => {
    data?.role?.menuPermission.forEach((menuItem) => {
      const isOrgApp = orgApps.has(menuItem.app.id);
      const appName = menuItem.app.slug.split("/").pop();

      if (isOrgApp) {
        if (uniqueApps.has(appName)) {
          uniqueAppsMenuItems[appName].push({
            name: menuItem.appMenuItem.name,
            slug: menuItem.appMenuItem.slug,
            icon: menuItem.appMenuItem.icon,
            description: menuItem.appMenuItem.description,
          });
        }
      }
    });
  });

  return uniqueAppsMenuItems[appName];
}

export function getRoleOrgWiseApps(rbacSessionData: any) {
  const apps = rbacSessionData.flatMap((data) => {
    const orgApps =
      data?.organization?.appOrganization.map((app) => app?.appId) || [];

    const uniqueApps = [];

    data?.role?.menuPermission.forEach((menuItem) => {
      // const appName = menuItem.app.slug.split("/").pop();
      const isOrgApp = orgApps.includes(menuItem.app.id);

      if (isOrgApp) {
        if (!uniqueApps.find((app) => app.name === menuItem.app.name)) {
          uniqueApps.push({
            name: menuItem.app.name,
            imageUrl: menuItem.app.imageUrl,
            slug: menuItem.app.slug,
          });
        }
        // uniqueApps.add({
        //   name: menuItem.app.name,
        //   imageUrl: menuItem.app.imageUrl,
        //   slug: menuItem.app.slug,
        // });
      }
    });

    return uniqueApps;
  });

  return apps;
}

// export function getRolewiseAppMenuItems(rbacSessionData: any, appName: string) {
//   if (!appName) return null;

//   const orgApps =

//   const roleAppBasedMenuItems = rbacSessionData?.reduce((acc, data) => {
//     const orgApps =
//       data?.organization?.appOrganization.map((app) => app?.appId) || [];

//     console.log({ orgApps });

//     const uniqueApps = new Set<string>();

//     data?.role?.menuPermission.forEach((menuItem) => {
//       const appName = menuItem.app.slug.split("/").pop();
//       const isOrgApp = orgApps.includes(menuItem.app.id);

//       if (isOrgApp) {
//         uniqueApps.add(appName);
//       }
//     });

//     console.log({ uniqueApps });

//     const uniqueAppsMenuItems = {};

//     uniqueApps.forEach((app: string) => {
//       uniqueAppsMenuItems[app] = [];
//     });

//     data?.role?.menuPermission.forEach((menuItem) => {
//       const isOrgApp = orgApps.includes(menuItem.app.id);
//       const appName = menuItem.app.slug.split("/").pop();

//       if (isOrgApp) {
//         if (uniqueApps.has(appName)) {
//           uniqueAppsMenuItems[appName].push({
//             name: menuItem.appMenuItem.name,
//             slug: menuItem.appMenuItem.slug,
//             icon: menuItem.appMenuItem.icon,
//             description: menuItem.appMenuItem.description,
//           });
//         }
//       }
//     });

//     console.log({ uniqueAppsMenuItems });

//     acc[appName] = uniqueAppsMenuItems[appName];

//     return uniqueAppsMenuItems;
//   }, {});
//   console.log(roleAppBasedMenuItems);
//   return roleAppBasedMenuItems[appName];
// }
