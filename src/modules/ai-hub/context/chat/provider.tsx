"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatContext } from "./context";
import { TChatMessage, TChatSession } from "../../types/chat-types";
import { useLLM } from "../../hooks/use-llm";
import {
  clearSessions,
  createNewSession,
  getSessionById,
  getSessions,
  removeMessageById,
  removeSessionById,
} from "../../serveractions/session-server-actions";
export type TChatProvider = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: TChatProvider) => {
  const params = useParams();
  const sessionId = params?.sessionId;

  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isAllSessionLoading, setAllSessionLoading] = useState<boolean>(true);
  const [isCurrentSessionLoading, setCurrentSessionLoading] =
    useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(
    undefined
  );

  const appendToCurrentSession = (props: TChatMessage) => {
    setCurrentSession((session) => {
      if (!session) return undefined;

      const existingMessage = session.messages.find(
        (message) => message.id === props.id
      );

      if (existingMessage) {
        return {
          ...session,
          messages: session.messages.map((message) => {
            if (message.id === props.id) return { message, ...props };
            return message;
          }),
        };
      }

      return {
        ...session,
        messages: [...session.messages, props],
      };
    });
  };

  const { runModel, stopGeneration } = useLLM({
    onChange: appendToCurrentSession,
  });

  const fetchCurrentSession = async () => {
    if (!sessionId) {
      return;
    }

    const [data] = await getSessionById({ sessionId: sessionId.toString() });
    if (data) {
      setCurrentSession(data.session);
      setCurrentSessionLoading(false);
    }

    if (!data) {
      const [data] = await createNewSession({ title: "Untitled" });

      if (data) {
        setCurrentSession(data);
        setCurrentSessionLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!sessionId) {
      console.log("Not fetching current session");
      return;
    }
    console.log("fetching current session");
    setCurrentSessionLoading(true);
    fetchCurrentSession();
  }, [sessionId]);

  const fetchAllSessions = async () => {
    const [data] = await getSessions();
    setSessions(data?.sessions ?? []);
    console.log(sessions);
    setAllSessionLoading(false);
  };

  const createSession = async () => {
    const [data] = await createNewSession({ title: "Untitled" });
    await fetchAllSessions();
    return data;
  };

  useEffect(() => {
    setAllSessionLoading(true);
    fetchAllSessions();
  }, []);

  const clearChatSessions = async () => {
    await clearSessions();
    await fetchAllSessions();
  };

  const removeSession = async (sessionId: string) => {
    setCurrentSessionLoading(true);
    await removeSessionById({ sessionId });
    await fetchAllSessions();
    setCurrentSessionLoading(false);
  };

  const removeMessage = async (messageId: string) => {
    if (!currentSession?.id) {
      return;
    }
    setCurrentSessionLoading(true);
    await removeMessageById({ sessionId: currentSession.id, messageId });
    await fetchCurrentSession();
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        refetchSessions: fetchAllSessions,
        isAllSessionLoading,
        isCurrentSessionLoading,
        createSession,
        runModel,
        clearChatSessions,
        removeSession,
        currentSession,
        stopGeneration,
        removeMessage,
        initialPrompt,
        setInitialPrompt,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
