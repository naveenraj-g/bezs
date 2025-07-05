"use client";

import { useEffect } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useChatSession } from "../use-chat-session";
import { useLLM } from "../use-llm";
import { TChatSession } from "../../types/chat-types";
import { useParams } from "next/navigation";

export const useInitChatStore = () => {
  const set = useChatStore.setState;
  const streamingMessage = useChatStore((props) => props.streamingMessage);

  const { getSessions, createNewSession, getSessionById } = useChatSession();
  const params = useParams();

  const fetchSessions = async () => {
    set({ isSessionLoading: true });
    const sessions = await getSessions();
    set({ sessions: sessions, isSessionLoading: false });
  };

  const fetchSession = async () => {
    if (!params?.sessionId) {
      return;
    }

    getSessionById(params?.sessionId as string).then((session) => {
      set({ currentSession: session });
    });
  };

  const { runModel } = useLLM({
    onInit: async (props) => {
      set({ streamingMessage: props });
    },
    onStreamStart: async () => {
      set({ error: undefined });
      set({ streamingMessage: undefined });
    },
    onStream: async (props) => {
      set({ streamingMessage: props });
    },
    onStreamEnd: async () => {
      fetchSessions().then(() => {
        set({ streamingMessage: undefined });
      });
    },
    onError: async (error) => {
      set({
        streamingMessage: error,
        error: "An error occurred while running the model",
      });
    },
  });

  const createSession: TChatSession | any = async () => {
    const newSession = await createNewSession();
    fetchSession();
    fetchSessions();

    return newSession;
  };

  useEffect(() => {
    (() => {
      if (!params?.sessionId) {
        return;
      }

      fetchSession();
    })();
  }, [params?.sessionId]);

  useEffect(() => {
    set({
      refetchSessions: fetchSessions,
      createSession,
      runModel,
    });

    fetchSessions();
  }, []);

  useEffect(() => {
    if (!streamingMessage) {
      fetchSession();
    }
  }, [streamingMessage]);
};
