"use client";

import { useEffect } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useChatSession } from "../use-chat-session";
import { useLLM } from "../use-llm";

export const useInitChatStore = () => {
  const set = useChatStore.setState;

  const { getSessions, createNewSession } = useChatSession();

  const fetchSessions = async () => {
    set({ isSessionLoading: true });
    const sessions = await getSessions();
    set({ sessions: sessions, isSessionLoading: false });
  };

  const { runModel } = useLLM({
    onStreamStart: () => {
      set({ lastStream: undefined });
      fetchSessions();
    },
    onStream: async (props) => {
      set({ lastStream: props });
    },
    onStreamEnd: () => {
      fetchSessions().then(() => {
        set({ lastStream: undefined });
      });
    },
  });

  const createSession = async () => {
    await createNewSession();
  };

  useEffect(() => {
    set({
      refetchSessions: fetchSessions,
      createSession,
      runModel,
    });

    fetchSessions();
  }, []);
};
