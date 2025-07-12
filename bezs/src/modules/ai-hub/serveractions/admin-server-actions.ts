"use server";

import { prismaAiHub } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";
import {
  AdminCreateAiModelSchema,
  AdminDeleteAiModelSchema,
} from "../schema/admin-schemas";

export const getModels = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const models = await prismaAiHub.aiModel.findMany();
      const total = await prismaAiHub.aiModel.count();

      return { models, total };
    } catch (err) {
      throw new Error(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : JSON.stringify(err)
      );
    }
  });

export const createModel = authProcedures
  .createServerAction()
  .input(AdminCreateAiModelSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.aiModel.create({
        data: {
          ...input,
        },
      });
    } catch (err) {
      throw new Error(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : JSON.stringify(err)
      );
    }
  });

export const deleteModel = authProcedures
  .createServerAction()
  .input(AdminDeleteAiModelSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.aiModel.delete({
        where: {
          id: input.modelId,
        },
      });
    } catch (err) {
      throw new Error(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : JSON.stringify(err)
      );
    }
  });
