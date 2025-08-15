"use server";

import { prismaAiHub } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";

export const getModelsName = authProcedures
  .createServerAction()
  .handler(async () => {
    const models = await prismaAiHub.aiModel.findMany({
      select: {
        id: true,
        modelName: true,
        displayName: true,
      },
    });

    return models;
  });
