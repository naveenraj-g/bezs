"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaMain } from "@/lib/prisma";

export async function getRoleData({ roleId }: { roleId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!roleId) {
    throw new Error("Missing required datas.");
  }

  const roleData = await prismaMain.role.findUnique({
    where: {
      id: roleId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return roleData;
}

export async function getAppMenuItems({ appId }: { appId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId) {
    throw new Error("Missing required datas.");
  }

  const appMenuItemsData = await prismaMain.appMenuItem.findMany({
    where: {
      appId,
    },
  });

  return appMenuItemsData;
}

export async function getAppActions({ appId }: { appId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId) {
    throw new Error("Missing required datas.");
  }

  const appActionsData = await prismaMain.appAction.findMany({
    where: {
      appId,
    },
  });

  return appActionsData;
}

export async function getRoleAppMenuItems({
  roleId,
  appId,
}: {
  roleId: string;
  appId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !roleId) {
    throw new Error("Missing required datas.");
  }

  const roleMenuItemsData = await prismaMain.menuPermission.findMany({
    where: {
      appId,
      roleId,
    },
  });

  return roleMenuItemsData;
}

export async function getRoleAppActions({
  roleId,
  appId,
}: {
  roleId: string;
  appId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !roleId) {
    throw new Error("Missing required datas.");
  }

  const roleActionsData = await prismaMain.actionPermission.findMany({
    where: {
      appId,
      roleId,
    },
  });

  return roleActionsData;
}

export async function mapAppMenuPermission({
  roleId,
  appId,
  appMenuItemId,
}: {
  roleId: string;
  appId: string;
  appMenuItemId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !roleId || !appMenuItemId) {
    throw new Error("Missing required datas.");
  }

  await prismaMain.menuPermission.create({
    data: {
      appId,
      roleId,
      appMenuItemId,
    },
  });
}

export async function mapAppActionPermission({
  roleId,
  appId,
  appActionId,
}: {
  roleId: string;
  appId: string;
  appActionId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !roleId || !appActionId) {
    throw new Error("Missing required datas.");
  }

  await prismaMain.actionPermission.create({
    data: {
      appId,
      roleId,
      appActionId,
    },
  });
}

export async function unmapAppMenuPermission({
  roleId,
  appId,
  appMenuItemId,
}: {
  roleId: string;
  appId: string;
  appMenuItemId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !roleId || !appMenuItemId) {
    throw new Error("Missing required datas.");
  }

  await prismaMain.menuPermission.delete({
    where: {
      roleId_appId_appMenuItemId: {
        roleId,
        appId,
        appMenuItemId,
      },
    },
  });
}

export async function unmapAppActionPermission({
  roleId,
  appId,
  appActionId,
}: {
  roleId: string;
  appId: string;
  appActionId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !roleId || !appActionId) {
    throw new Error("Missing required datas.");
  }

  await prismaMain.actionPermission.delete({
    where: {
      roleId_appId_appActionId: {
        roleId,
        appId,
        appActionId,
      },
    },
  });
}
