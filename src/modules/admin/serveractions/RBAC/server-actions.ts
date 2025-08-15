"use server";

import { prismaMain } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

export async function getAllOrganizations() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const allOrgData = await prismaMain.organization.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return allOrgData;
}

export async function getAllRoles() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const allRoleData = await prismaMain.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return allRoleData;
}

export async function getOrgMembers({ orgId }: { orgId: string }) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!orgId) throw new Error("Missing required datas.");

  const usersData = await prismaMain.member.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  return usersData.map((member) => member.user);
}

export async function mapRBACUserOrgRole({
  orgId,
  userId,
  roleId,
}: {
  orgId: string;
  userId: string;
  roleId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!orgId || !userId || !roleId) throw new Error("Missing required datas.");

  await prismaMain.rBAC.create({
    data: {
      organizationId: orgId,
      roleId,
      userId,
    },
  });
}

export async function unmapRBACUserOrgRole({
  orgId,
  userId,
  roleId,
}: {
  orgId: string;
  userId: string;
  roleId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!orgId || !userId || !roleId) throw new Error("Missing required datas.");

  await prismaMain.rBAC.delete({
    where: {
      organizationId_userId_roleId: {
        organizationId: orgId,
        roleId,
        userId,
      },
    },
  });
}
