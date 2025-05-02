/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { auth } from "@/modules/auth/services/better-auth/auth";

async function getData(userName: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: userName,
    },
  });

  return user;
}

export async function addMemberToOrg({
  userName,
  organizationId,
  role = "member",
}: {
  userName: string;
  organizationId: string;
  role?: "member" | "admin" | "owner";
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const user = await getData(userName);
  if (!user) {
    throw new Error("User not found");
  }

  const userId = user?.id;

  await auth.api.addMember({
    body: {
      userId,
      organizationId,
      role,
    },
  });
}

export async function getRole({ roleId }: { roleId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!roleId) {
    throw new Error("Missing required datas.");
  }

  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
    },
  });

  return role;
}

export async function addRole({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!name || !description) {
    throw new Error("Missing required datas.");
  }

  await prisma.role.create({
    data: {
      name,
      description,
    },
  });
}

export async function editRole({
  roleId,
  name,
  description,
}: {
  roleId: string;
  name: string;
  description: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!roleId || !name || !description) {
    throw new Error("Missing required datas.");
  }

  await prisma.role.update({
    where: {
      id: roleId,
    },
    data: {
      name,
      description,
    },
  });
}

export async function deleteRole({ roleId }: { roleId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!roleId) {
    throw new Error("Missing required datas.");
  }

  await prisma.role.delete({
    where: {
      id: roleId,
    },
  });
}

export async function addApp({
  name,
  slug,
  description,
  type,
}: {
  name: string;
  slug: string;
  description: string;
  type: "platform" | "custom";
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!name || !description || !slug || !type) {
    throw new Error("Missing required datas.");
  }

  await prisma.app.create({
    data: {
      name,
      slug,
      description,
      type,
    },
  });
}

export async function getApp({ appId }: { appId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId) {
    throw new Error("Missing required datas.");
  }

  const app = await prisma.app.findFirst({
    where: {
      id: appId,
    },
  });

  return app;
}

export async function editApp({
  appId,
  name,
  slug,
  description,
  type,
}: {
  appId: string;
  name: string;
  slug: string;
  description: string;
  type: "platform" | "custom";
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !name || !description || !slug || !type) {
    throw new Error("Missing required datas.");
  }

  await prisma.app.update({
    where: {
      id: appId,
    },
    data: {
      name,
      slug,
      description,
      type,
    },
  });
}

export async function deleteApp({ appId }: { appId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId) {
    throw new Error("Missing required datas.");
  }

  await prisma.app.delete({
    where: {
      id: appId,
    },
  });
}

export async function addAppMenuItem({
  appId,
  name,
  slug,
  icon,
  description,
}: {
  appId: string;
  name: string;
  slug: string;
  icon?: string;
  description: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !name || !slug || !description) {
    throw new Error("Missing required datas.");
  }

  await prisma.appMenuItem.create({
    data: {
      appId,
      name,
      slug,
      icon,
      description,
    },
  });
}

export async function getAppMenuItem({
  appMenuItemId,
}: {
  appMenuItemId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appMenuItemId) {
    throw new Error("Missing required datas.");
  }

  const appMenuItem = await prisma.appMenuItem.findUnique({
    where: {
      id: appMenuItemId,
    },
  });

  return appMenuItem;
}

export async function editAppMenuItem({
  appMenuItemId,
  name,
  slug,
  icon,
  description,
}: {
  appMenuItemId: string;
  name: string;
  slug: string;
  icon?: string;
  description: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appMenuItemId || !name || !slug || !description) {
    throw new Error("Missing required datas.");
  }

  await prisma.appMenuItem.update({
    where: {
      id: appMenuItemId,
    },
    data: {
      name,
      slug,
      icon,
      description,
    },
  });
}

export async function deleteAppMenuItem({
  appMenuItemId,
}: {
  appMenuItemId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appMenuItemId) {
    throw new Error("Missing required datas.");
  }

  await prisma.appMenuItem.delete({
    where: {
      id: appMenuItemId,
    },
  });
}

export async function addAppAction({
  appId,
  actionName,
  actionType,
  description,
  icon,
}: {
  appId: string;
  actionName: string;
  actionType: "button" | "link";
  description: string;
  icon?: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !actionName || !description || !actionType) {
    throw new Error("Missing required datas.");
  }

  await prisma.appAction.create({
    data: {
      appId,
      actionName,
      actionType,
      description,
      icon,
    },
  });
}

export async function getAppAction({ appActionId }: { appActionId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appActionId) {
    throw new Error("Missing required datas.");
  }

  const appMenuItem = await prisma.appAction.findUnique({
    where: {
      id: appActionId,
    },
  });

  return appMenuItem;
}

export async function editAppAction({
  appActionId,
  actionName,
  actionType,
  description,
  icon,
}: {
  appActionId: string;
  actionName: string;
  actionType: "button" | "link";
  description: string;
  icon?: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appActionId || !actionName || !description || !actionType) {
    throw new Error("Missing required datas.");
  }

  await prisma.appAction.update({
    where: {
      id: appActionId,
    },
    data: {
      actionName,
      actionType,
      description,
      icon,
    },
  });
}

export async function deleteAppAction({
  appActionId,
}: {
  appActionId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appActionId) {
    throw new Error("Missing required datas.");
  }

  await prisma.appAction.delete({
    where: {
      id: appActionId,
    },
  });
}
