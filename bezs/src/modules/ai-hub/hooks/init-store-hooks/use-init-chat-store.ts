"use client";

import { useEffect } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useChatSession } from "../use-chat-session";
import { useLLM } from "../use-llm";
import { TChatSession } from "../../types/chat-types";
import { useParams } from "next/navigation";

export const useInitChatStore = () => {
  const set = useChatStore.setState;

  const { getSessions, createNewSession, getSessionById } = useChatSession();
  const params = useParams();

  const fetchSessions = async () => {
    set({ isSessionLoading: true });
    const sessions = await getSessions();
    set({ sessions: sessions, isSessionLoading: false });
  };

  const fetchSession = async () => {
    getSessionById(params?.sessionId as string).then((session) => {
      set({ currentSession: session });
    });
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

  const createSession: TChatSession | any = async () => {
    const newSession = await createNewSession();
    fetchSession();

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
};
