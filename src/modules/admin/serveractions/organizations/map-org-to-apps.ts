"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

export async function getAllApps() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const allApps = await prisma.app.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return allApps;
}

export async function getOrganization({
  organizationId,
}: {
  organizationId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!organizationId) {
    throw new Error("Missing required datas.");
  }

  const orgData = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  return orgData;
}

export async function getOrganizationApps({
  organizationId,
}: {
  organizationId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!organizationId) {
    throw new Error("Missing required datas.");
  }

  const orgAppsData = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      appOrganization: {
        include: {
          app: true,
        },
      },
    },
  });

  return orgAppsData;
}

export async function addAppToOrganization({
  appId,
  organizationId,
}: {
  appId: string;
  organizationId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !organizationId) {
    throw new Error("Missing required datas.");
  }

  await prisma.appOrganization.create({
    data: {
      appId,
      organizationId,
    },
  });
}

export async function removeAppFromOrganization({
  appId,
  organizationId,
}: {
  appId: string;
  organizationId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!appId || !organizationId) {
    throw new Error("Missing required datas.");
  }

  await prisma.appOrganization.delete({
    where: {
      appId_organizationId: {
        appId,
        organizationId,
      },
    },
  });
}
