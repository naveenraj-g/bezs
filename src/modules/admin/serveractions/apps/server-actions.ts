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
