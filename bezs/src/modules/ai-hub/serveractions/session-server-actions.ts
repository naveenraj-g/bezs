"use server";

import { prismaAiHub } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";
import { z } from "zod";
import { chatMessageForDBSchema } from "../schema/session-schema";

export const getSessions = authProcedures
  .createServerAction()
  .handler(async ({ ctx }) => {
    const {
      user: { id: userId },
    } = ctx;

    try {
      const sessions = await prismaAiHub.session.findMany({
        where: {
          userId,
        },
        include: {
          messages: true,
        },
      });

      return { sessions };
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

export const getSessionById = authProcedures
  .createServerAction()
  .input(
    z.object({
      sessionId: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    const {
      user: { id: userId },
    } = ctx;

    try {
      const session = await prismaAiHub.session.findUnique({
        where: {
          id: input.sessionId,
          userId,
        },
        include: {
          messages: true,
        },
      });

      return { session };
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

export const createNewSession = authProcedures
  .createServerAction()
  .input(
    z.object({
      title: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    const {
      user: { id: userId },
    } = ctx;

    const [data] = await getSessions();

    if (data) {
      const latestSession = data.sessions.pop();

      if (latestSession?.messages.length === 0) {
        return latestSession;
      }
    }

    try {
      const session = await prismaAiHub.session.create({
        data: {
          userId,
          title: input.title,
        },
        include: {
          messages: true,
        },
      });

      return session;
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

export const addMessageToSessionDB = authProcedures
  .createServerAction()
  .input(chatMessageForDBSchema)
  .handler(async ({ input }) => {
    if (!input.sessionId) {
      throw new Error("Session not found!");
    }

    const { id, sessionId, ...messageData } = input;

    try {
      if (id) {
        const isExistingMessage = await prismaAiHub.message.findUnique({
          where: {
            id,
          },
        });

        if (isExistingMessage && isExistingMessage.sessionId === sessionId) {
          const message = await prismaAiHub.message.update({
            where: {
              id,
              sessionId,
            },
            data: {
              ...messageData,
            },
          });
          return message;
        }
      }

      const message = await prismaAiHub.message.create({
        data: {
          id: input.id,
          sessionId,
          ...messageData,
        },
      });

      return message;
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

export const updateSessionTitle = authProcedures
  .createServerAction()
  .input(
    z.object({
      sessionId: z.string().uuid(),
      title: z.string(),
    })
  )
  .handler(async ({ input }) => {
    if (!input.sessionId) {
      throw new Error("Session not found!");
    }

    try {
      await prismaAiHub.session.update({
        where: {
          id: input.sessionId,
        },
        data: {
          title: input.title,
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

export const clearSessions = authProcedures
  .createServerAction()
  .handler(async () => {
    try {
      await prismaAiHub.session.deleteMany();
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

export const removeSessionById = authProcedures
  .createServerAction()
  .input(
    z.object({
      sessionId: z.string().uuid(),
    })
  )
  .handler(async ({ input }) => {
    if (!input.sessionId) {
      throw new Error("Session not found!");
    }

    try {
      await prismaAiHub.session.delete({
        where: {
          id: input.sessionId,
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

export const removeMessageById = authProcedures
  .createServerAction()
  .input(
    z.object({
      sessionId: z.string().uuid(),
      messageId: z.string().uuid(),
    })
  )
  .handler(async ({ input }) => {
    if (!input.sessionId) {
      throw new Error("Session not found!");
    }

    try {
      await prismaAiHub.message.delete({
        where: {
          id: input.messageId,
        },
      });

      console.log("Message deleted");
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
