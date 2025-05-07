export function formattedRBACSessionData(session) {
  const filteredData = session.userRBAC.reduce((acc, data) => {
    const roleName = data?.role?.name;
    if (!roleName) return acc;

    const orgApps =
      data?.organization?.appOrganization.map((app) => app?.appId) || [];

    const uniqueSlugs = new Set<string>();

    data?.role?.menuPermission.forEach((menuItem) => {
      const isOrgApp = orgApps.includes(menuItem.app.id);

      if (isOrgApp) {
        uniqueSlugs.add(menuItem.app.slug);
      }

      if (
        orgApps.length > 0 &&
        orgApps.includes(menuItem?.appId) &&
        menuItem?.appMenuItem?.slug
      ) {
        uniqueSlugs.add(menuItem?.appMenuItem?.slug);
      }
    });

    acc[roleName] = Array.from(uniqueSlugs);
    return acc;
  }, {});

  return filteredData;
}
