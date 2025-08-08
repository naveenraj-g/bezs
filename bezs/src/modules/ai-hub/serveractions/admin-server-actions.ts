"use server";

import { prismaAiHub } from "@/lib/prisma";
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
} from "../schema/admin-schemas";

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

export const getModelsForMapAssistant = authProcedures
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
    const { modelId, ...values } = input;

    try {
      await prismaAiHub.assistant.create({
        data: {
          modelId: String(modelId),
          ...values,
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

export const editAssistant = authProcedures
  .createServerAction()
  .input(AdminEditAssistantSchema)
  .handler(async ({ input }) => {
    const { id, modelId, ...data } = input;
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
