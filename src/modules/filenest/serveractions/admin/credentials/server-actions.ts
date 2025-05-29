"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaFileNest } from "@/lib/prisma";
import { ADMIN_ROLE } from "@/modules/filenest/utils/roles";

export async function getAllCredentialsData() {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user?.role !== ADMIN_ROLE) {
    throw new Error("Unauthorized!");
  }

  const credentialsData =
    await prismaFileNest.cloudStorageCredentials.findMany();
  const total = await prismaFileNest.cloudStorageCredentials.count();

  return { credentialsData, total };
}
