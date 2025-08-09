"use server";

import { prismaAiHub, prismaMain } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";

export const getAssistantsData = authProcedures
  .createServerAction()
  .handler(async ({ ctx }) => {
    const userId = ctx.user.id;

    const user = await prismaMain.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    const role = user?.role;

    if (!role) {
      return [];
    }

    const assistants = await prismaAiHub.assistant.findMany({
      where: {
        accessRoles: {
          every: {
            name: role,
          },
        },
      },
    });

    return assistants;
  });
