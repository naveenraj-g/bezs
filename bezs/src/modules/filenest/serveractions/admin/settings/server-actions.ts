"use server";

import { prismaFileNest, prismaMain } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import {
  deleteAdminSettingsSchema,
  fullAdminSettingsSchema,
} from "@/modules/filenest/schema/admin-settings-modal-schema";
import { ADMIN_ROLE } from "@/modules/filenest/utils/roles";
import { authProcedures } from "@/shared/server-actions/server-action";

export const getAllSettingsData = authProcedures
  .createServerAction()
  .handler(async () => {
    const session = await getServerSession();

    if (!session || session?.user?.role !== ADMIN_ROLE) {
      throw new Error("User session not found.");
    }

    const settingsData = await prismaFileNest.appStorageSetting.findMany({
      include: {
        credential: {
          select: {
            id: true,
            name: true,
            bucketName: true,
          },
        },
      },
    });
    const total = await prismaFileNest.appStorageSetting.count();

    return { settingsData, total };
  });

export const getAllAppsAndCredentialsData = authProcedures
  .createServerAction()
  .handler(async () => {
    const session = await getServerSession();

    if (!session || session?.user?.role !== ADMIN_ROLE) {
      throw new Error("User session not found.");
    }

    const appsData = await prismaMain.app.findMany({
      include: {
        appOrganization: {
          select: {
            organizationId: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const credentialsData =
      await prismaFileNest.cloudStorageCredential.findMany();

    return { appsData, credentialsData };
  });

export const createAdminSettings = authProcedures
  .createServerAction()
  .input(fullAdminSettingsSchema)
  .handler(async ({ input }) => {
    const session = await getServerSession();

    if (!session || session?.user?.role !== ADMIN_ROLE) {
      throw new Error("User session not found.");
    }

    await prismaFileNest.appStorageSetting.create({
      data: {
        ...input,
      },
    });

    return { message: "App Storage Settings created Successfully." };
  });

export const EditAdminSettings = authProcedures
  .createServerAction()
  .input(fullAdminSettingsSchema)
  .handler(async ({ input }) => {
    const session = await getServerSession();

    if (!session || session?.user?.role !== ADMIN_ROLE) {
      throw new Error("User session not found.");
    }

    const { id, ...reminingDatas } = input;

    await prismaFileNest.appStorageSetting.update({
      where: {
        id: id || "",
      },
      data: {
        ...reminingDatas,
      },
    });

    return { message: "App Storage Settings updated Successfully." };
  });

export const deleteAdminSettings = authProcedures
  .createServerAction()
  .input(deleteAdminSettingsSchema)
  .handler(async ({ input }) => {
    const session = await getServerSession();

    if (!session || session?.user?.role !== ADMIN_ROLE) {
      throw new Error("User session not found.");
    }

    await prismaFileNest.appStorageSetting.delete({
      where: {
        id: input.id,
      },
    });

    return { message: "App Storage Settings deleted Successfully." };
  });
