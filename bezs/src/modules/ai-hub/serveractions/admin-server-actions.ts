"use server";

import { prismaAiHub, prismaMain } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";
import {
  AdminCreateAiModelSchema,
  AdminDeleteAiModelSchema,
  AdminCreatePromptsSchema,
  AdminEditPromptByIdSchema,
  AdminDeletePromptSchema,
  AdminCreateAssistantSchema,
  AdminEditAssistantSchema,
  AdminDeleteAssistantSchema,
  AdminEditAiModelSchema,
  AdminCreateModelSettingsSchema,
  AdminEditModelSettingsSchema,
  AdminCreateKnowledgeBasedSchema,
  AdminKnowledgeBasedAssistantIdSchema,
} from "../schema/admin-schemas";
import { getAppSlugServerOnly } from "@/utils/getAppSlugServerOnly";

const getUniqueRoles = async () => {
  const { appSlug } = await getAppSlugServerOnly();

  const currentAppOrgId = await prismaMain.app.findFirst({
    where: {
      slug: appSlug,
    },
    select: {
      appOrganization: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  let uniqueRoles: string[] = [];

  if (currentAppOrgId?.appOrganization) {
    const orgId = currentAppOrgId?.appOrganization[0].organizationId;

    const roles = await prismaMain.rBAC.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    uniqueRoles = Array.from(new Set(roles.map((r) => r.role.name)));
  }
  return { uniqueRoles };
};

// Models

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

export const getModelsForMapAssistantAndRoles = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const { uniqueRoles } = await getUniqueRoles();

      const models = await prismaAiHub.aiModel.findMany({
        select: {
          id: true,
          displayName: true,
          modelName: true,
        },
      });

      return { models, uniqueRoles };
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
          modelSettings: {
            create: {},
          },
        },
        include: {
          modelSettings: true,
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

export const editModel = authProcedures
  .createServerAction()
  .input(AdminEditAiModelSchema)
  .handler(async ({ input }) => {
    const { id, ...data } = input;

    try {
      await prismaAiHub.aiModel.update({
        where: {
          id,
        },
        data: {
          ...data,
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
          id: String(input.modelId),
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

// Model Settings

export const getModelsForSettingsSelect = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const models = await prismaAiHub.aiModel.findMany({
        select: {
          id: true,
          displayName: true,
          modelName: true,
        },
      });

      return { models };
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

export const getModelSettings = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const modelSettings = await prismaAiHub.modelSettings.findMany({
        include: {
          model: {
            select: {
              displayName: true,
              modelName: true,
            },
          },
        },
      });
      const total = await prismaAiHub.modelSettings.count();

      return { modelSettings, total };
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

export const createModelSettings = authProcedures
  .createServerAction()
  .input(AdminCreateModelSettingsSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.modelSettings.create({
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

export const editModelSettings = authProcedures
  .createServerAction()
  .input(AdminEditModelSettingsSchema)
  .handler(async ({ input }) => {
    const { id, ...data } = input;

    try {
      await prismaAiHub.modelSettings.update({
        where: {
          id: Number(id),
        },
        data: {
          ...data,
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

export const deleteModelSettings = authProcedures
  .createServerAction()
  .input(AdminDeleteAiModelSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.modelSettings.delete({
        where: {
          id: Number(input.modelId),
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

// Prompts

export const getPrompts = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const prompts = await prismaAiHub.prompts.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      });
      const total = await prismaAiHub.prompts.count();

      return { prompts, total };
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

export const createPrompts = authProcedures
  .createServerAction()
  .input(AdminCreatePromptsSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.prompts.create({
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

export const editPrompt = authProcedures
  .createServerAction()
  .input(AdminEditPromptByIdSchema)
  .handler(async ({ input }) => {
    const { id, ...promptData } = input;
    try {
      await prismaAiHub.prompts.update({
        where: {
          id,
        },
        data: {
          ...promptData,
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

export const deletePrompt = authProcedures
  .createServerAction()
  .input(AdminDeletePromptSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.prompts.delete({
        where: {
          id: Number(input.promptId),
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

// Assistants

export const getAssistants = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      const assistants = await prismaAiHub.assistant.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          model: {
            select: {
              id: true,
              displayName: true,
              modelName: true,
            },
          },
          accessRoles: {
            select: {
              id: true,
              name: true,
              assistantId: true,
            },
          },
        },
      });
      const total = await prismaAiHub.assistant.count();

      return { assistants, total };
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

export const createAssistant = authProcedures
  .createServerAction()
  .input(AdminCreateAssistantSchema)
  .handler(async ({ input }) => {
    const { modelId, role, ...values } = input;

    try {
      const data = await prismaAiHub.assistant.create({
        data: {
          modelId: String(modelId),
          ...values,
        },
      });

      if (role && data.id) {
        await prismaAiHub.accessRole.create({
          data: {
            name: role,
            assistantId: data.id,
          },
        });
      }
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

export const editAssistant = authProcedures
  .createServerAction()
  .input(AdminEditAssistantSchema)
  .handler(async ({ input }) => {
    const { id, modelId, roleId, role, ...data } = input;
    try {
      await prismaAiHub.assistant.update({
        where: {
          id,
        },
        data: {
          modelId: Boolean(modelId) ? String(modelId) : null,
          ...data,
        },
      });

      await prismaAiHub.accessRole.update({
        where: {
          id: Number(roleId),
        },
        data: {
          name: role,
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

export const deleteAssistant = authProcedures
  .createServerAction()
  .input(AdminDeleteAssistantSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.assistant.delete({
        where: {
          id: Number(input.assistantId),
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

export const getKnowledgeBased = authProcedures
  .createServerAction()
  .input(AdminKnowledgeBasedAssistantIdSchema)
  .handler(async ({ input }) => {
    try {
      const knowledgeBased = await prismaAiHub.knowledgeBased.findMany({
        where: {
          assistantId: input.assistantId,
        },
      });
      const total = await prismaAiHub.knowledgeBased.count({
        where: {
          assistantId: input.assistantId,
        },
      });

      return { knowledgeBased, total };
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

export const createKnowledgeBased = authProcedures
  .createServerAction()
  .input(AdminCreateKnowledgeBasedSchema)
  .handler(async ({ input }) => {
    try {
      await prismaAiHub.knowledgeBased.create({
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
