"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaMain } from "@/lib/prisma";

export async function getAllOrganizations() {
  const session = await getServerSession();

  if (!session?.user?.role) {
    throw new Error("Unauthorized!");
  }

  const orgData = await prismaMain.organization.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return orgData;
}
