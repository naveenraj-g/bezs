"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatContext } from "./context";
import { TChatSession, TStreamProps } from "../../types/chat-types";
import { useLLM } from "../../hooks/use-llm";
import { useChatSession } from "../../hooks/use-chat-session";
export type TChatProvider = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: TChatProvider) => {
  const params = useParams();
  const sessionId = params?.sessionId;

  const {
    getSessions,
    createNewSession,
    getSessionById,
    clearSessions,
    removeSessionById,
    removeMessageById,
  } = useChatSession();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isAllSessionLoading, setAllSessionLoading] = useState<boolean>(true);
  const [isCurrentSessionLoading, setCurrentSessionLoading] =
    useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const [streamingMessage, setStreamingMessage] = useState<TStreamProps>();

  const { runModel, stopGeneration } = useLLM({
    onInit: async (props) => {
      setStreamingMessage(props);
    },
    onStreamStart: async (props) => {
      setStreamingMessage(props);
    },
    onStream: async (props) => {
      setStreamingMessage(props);
    },
    onStreamEnd: async () => {
      fetchAllSessions().then(() => {
        setStreamingMessage(undefined);
      });
    },
    onError: async (error) => {
      setStreamingMessage(error);
    },
  });

  const fetchCurrentSession = async () => {
    if (!sessionId) {
      return;
    }
    getSessionById(sessionId?.toString())
      .then((session) => {
        setCurrentSession(session);
        setCurrentSessionLoading(false);
      })
      .catch(() => {
        setCurrentSessionLoading(false);
      });
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    setCurrentSessionLoading(true);
    fetchCurrentSession();
  }, [sessionId]);

  const fetchAllSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setAllSessionLoading(false);
  };

  const createSession = async () => {
    const newSession = await createNewSession();
    fetchAllSessions();
    return newSession;
  };

  useEffect(() => {
    if (!streamingMessage) {
      fetchCurrentSession();
    }
  }, [streamingMessage]);

  useEffect(() => {
    setAllSessionLoading(true);
    fetchAllSessions();
  }, []);

  const clearChatSessions = async () => {
    clearSessions().then(() => {
      setSessions([]);
    });
  };

  const removeSession = async (sessionId: string) => {
    await removeSessionById(sessionId);
    await fetchAllSessions();
  };

  const removeMessage = (messageId: string) => {
    if (!currentSession?.id) {
      return;
    }
    removeMessageById(currentSession?.id, messageId).then(async () => {
      fetchAllSessions();
    });
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
        streamingMessage,
        currentSession,
        stopGeneration,
        removeMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
