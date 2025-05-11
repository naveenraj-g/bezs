import { prismaMain } from "@/lib/prisma";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";

const appMenuItems = [
  {
    name: "Apps",
    slug: "/bezs/admin/manage-apps",
    description: "Manage Apps and its functionality.",
    icon: "LayoutGrid",
  },
  {
    name: "RBAC",
    slug: "/bezs/admin/rbac",
    description:
      "Manage user roles and permissions across your organization to control access to features and data.",
    icon: "ShieldUser",
  },
  {
    name: "Users",
    slug: "/bezs/admin/manage-users",
    description: "Manage users and their account permissions here.",
    icon: "User",
  },
  {
    name: "Organizations",
    slug: "/bezs/admin/manage-organizations",
    description: "Manage Organizations and menbers.",
    icon: "Building",
  },
  {
    name: "Roles",
    slug: "/bezs/admin/manage-roles",
    description:
      "Manage user roles and permissions across your organization to control access to features and data.",
    icon: "UserCog",
  },
];

async function initialCreateUserAdmin() {
  "use client";

  try {
    authClient.signUp.email(
      {
        email: "testuser.gnr@gmail.com",
        password: "12345678",
        username: "admin",
        name: "Admin",
      },
      {
        onSuccess() {
          console.log("user created successfully");
        },
        onError(ctx) {
          console.log(ctx.error.message);
        },
      }
    );
    console.log("user created");
  } catch (err) {
    console.log(err);
  }
}

// initialCreateUserAdmin();

async function initialSetup() {
  "use server";

  // retrieving first created user
  const firstUser = await prismaMain.user.findFirst();

  // assigning admin role
  await prismaMain.user.update({
    where: {
      id: firstUser?.id,
    },
    data: {
      role: "admin",
    },
  });

  // creating Admin app
  await prismaMain.app.create({
    data: {
      name: "Admin",
      slug: "/bezs/admin",
      description:
        "A centralized dashboard for managing users, roles, permissions, and organizational settings across all connected applications.",
      type: "custom",
    },
  });
  const app = await prismaMain.app.findFirst();

  // create Admin app Menu Items
  appMenuItems.forEach(async (menuItem) => {
    await prismaMain.appMenuItem.create({
      data: {
        name: menuItem.name,
        slug: menuItem.slug,
        description: menuItem.description,
        icon: menuItem.icon,
        appId: app?.id || "",
      },
    });
  });

  // creating Admin Hub organization
  await prismaMain.organization.create({
    data: {
      name: "Admin Hub",
      slug: "admin-hub",
      members: {
        create: {
          userId: firstUser?.id || "",
          role: "owner",
        },
      },
      appOrganization: {
        create: {
          appId: app?.id || "",
        },
      },
    },
  });
  const org = await prismaMain.organization.findFirst();

  // creating admin role
  await prismaMain.role.create({
    data: {
      name: "admin",
      description:
        "Has full access to manage users, roles, permissions, settings, and all app-related data within the organization.",
    },
  });
  const adminRole = await prismaMain.role.findFirst();

  const adminMenuItems = await prismaMain.appMenuItem.findMany({
    where: {
      appId: app?.id || "",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  adminMenuItems.forEach(async (item) => {
    await prismaMain.menuPermission.create({
      data: {
        appId: app?.id || "",
        appMenuItemId: item?.id || "",
        roleId: adminRole?.id || "",
      },
    });
  });

  await prismaMain.rBAC.create({
    data: {
      organizationId: org?.id || "",
      roleId: adminRole?.id || "",
      userId: firstUser?.id || "",
    },
  });
}

initialSetup();
