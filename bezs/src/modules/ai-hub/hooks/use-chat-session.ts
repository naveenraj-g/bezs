import { get, set } from "idb-keyval";
import { TChatMessage, TChatSession } from "../types/chat-types";
import { v4 } from "uuid";
import moment from "moment";

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
        if (session?.messages?.length === 0) {
          return {
            ...session,
            messages: [...session.messages, chatMessage],
            title: chatMessage.rawHuman,
            updatedAt: moment().toISOString(),
          };
        }
        return {
          ...session,
          messages: [...session.messages, chatMessage],
          updatedAt: moment().toISOString(),
        };
      }

      return session;
    });

    await set("chat-sessions", newSessions);
  };

  const createNewSession = async () => {
    const sessions = (await getSessions()) || [];

    const latestSession = sortSessions(sessions, "createdAt")?.[0];
    if (latestSession && latestSession?.messages?.length === 0) {
      return latestSession;
    }

    const newSession: TChatSession = {
      id: v4(),
      messages: [],
      title: "Untitled",
      createdAt: moment().toISOString(),
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

  const clearSessions = async () => {
    await set("chat-sessions", []);
  };

  const sortSessions = (
    sessions: TChatSession[],
    sortBy: "createdAt" | "updatedAt"
  ) => {
    return sessions.sort((a, b) => moment(b[sortBy]).diff(moment(a[sortBy])));
  };

  return {
    getSessions,
    setSession,
    getSessionById,
    removeSessionById,
    addMessageToSession,
    updateSession,
    createNewSession,
    clearSessions,
    sortSessions,
  };
};

// 6:57
