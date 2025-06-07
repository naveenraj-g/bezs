"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaMain } from "@/lib/prisma";

export async function getUser() {}

export async function getAllRolesNameOnly() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const roleData = await prismaMain.role.findMany({
    select: {
      name: true,
    },
  });

  return roleData;
}
