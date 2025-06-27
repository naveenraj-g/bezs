import { get, set } from "idb-keyval";
import { TChatMessage, TChatSession } from "../types/chat-types";
import { v4 } from "uuid";

export const useChatSession = () => {
  const getSessions = async (): Promise<TChatSession[]> => {
    return (await get("chat-sessions")) || [];
  };

  const setSession = async (chatSession: TChatSession) => {
    const sessions = await getSessions();
    const newSessions = [...sessions, chatSession];
    await set("chat-sessions", newSessions);
  };

  const getSessionById = async (id: string) => {
    const sessions = await getSessions();
    return sessions.find((session: TChatSession) => session.id === id);
  };

  const removeSessionById = async (id: string) => {
    const sessions = await getSessions();
    const newSessions = sessions.filter(
      (session: TChatSession) => session.id !== id
    );
    await set("chat-sessions", newSessions);
  };

  const addMessageToSession = async (
    sessionId: string,
    chatMessage: TChatMessage
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session: TChatSession) => {
      if (session.id === sessionId) {
        return { ...session, messages: [...session.messages, chatMessage] };
      }

      return session;
    });

    await set("chat-sessions", newSessions);
  };

  const createNewSession = async () => {
    const sessions = await getSessions();

    const latestSession = sessions?.[0];
    if (latestSession?.messages?.length === 0) {
      return latestSession;
    }

    const newSession: TChatSession = {
      id: v4(),
      messages: [],
      title: "Untitled",
      createdAt: new Date().toISOString(),
    };

    const newSessions = [newSession, ...sessions];
    await set("chat-sessions", newSessions);
    return newSessions;
  };

  const updateSession = async (
    sessionId: string,
    newSession: Omit<TChatSession, "id">
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session: TChatSession) => {
      if (session.id === sessionId) {
        return {
          ...session,
          ...newSession,
        };
      }

      return session;
    });

    await set("chat-sessions", newSessions);
  };

  return {
    getSessions,
    setSession,
    getSessionById,
    removeSessionById,
    addMessageToSession,
    updateSession,
    createNewSession,
  };
};
