"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaMain } from "@/lib/prisma";

export async function getAllAppsData() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const appsData = await prismaMain.app.findMany({
    include: {
      _count: {
        select: {
          appMenuItems: true,
          appActions: true,
        },
      },
    },
  });

  const total = await prismaMain.app.count();

  return { appsData, total };
}

export async function getAppMenuItems({
  appId,
}: {
  appId: string | undefined;
}) {
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

  const total = await prismaMain.appMenuItem.count({
    where: {
      appId,
    },
  });

  return { appMenuItemsData, total };
}

export async function getAppActions({ appId }: { appId: string | undefined }) {
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

  const total = await prismaMain.appAction.count({
    where: {
      appId,
    },
  });

  return { appActionsData, total };
}

export async function getRBACuserRole() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const rbacData = await prismaMain.rBAC.findMany({
    orderBy: [
      {
        user: {
          name: "asc",
        },
      },
    ],
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      },
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const total = await prismaMain.rBAC.count();

  return { rbacData, total };
}
