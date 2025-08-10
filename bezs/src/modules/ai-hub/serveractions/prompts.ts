"use server";

import { prismaAiHub } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";

export const getPrompts = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const prompts = await prismaAiHub.prompts.findMany({
        where: {
          status: "ACTIVE",
        },
      });

      return { prompts };
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
