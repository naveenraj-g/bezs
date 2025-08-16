"use server";

import { prismaAiHub } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";
import { z } from "zod";

export const getModelsName = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const models = await prismaAiHub.aiModel.findMany({
        select: {
          id: true,
          modelName: true,
          displayName: true,
          tokens: true,
          modelSettings: {
            select: {
              defaultPrompt: true,
              maxToken: true,
              temperature: true,
              topK: true,
              topP: true,
            },
          },
        },
      });

      return models;
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

export const goodResponseMessage = authProcedures
  .createServerAction()
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          isGoodResponse: true,
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
