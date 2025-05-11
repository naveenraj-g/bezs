"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaMain } from "@/lib/prisma";

export async function changeUserRole({
  userId,
  roleName,
}: {
  userId: string;
  roleName: string;
}) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized!");
  }

  const userAllocatedRoles = [
    "guest",
    ...session.userRBAC?.map((data) => data.role?.name),
  ];

  if (!userAllocatedRoles.includes(roleName)) {
    throw new Error("You are not allowed to change this role.");
  }

  if (!userId || !roleName) {
    throw new Error("Missing required datas.");
  }

  await prismaMain.user.update({
    where: {
      id: userId,
    },
    data: {
      role: roleName,
    },
  });
}
