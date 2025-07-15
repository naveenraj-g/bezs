import { create } from "zustand";
import { PromptProps, TChatSession, TStreamProps } from "../types/chat-types";

export type TChatStore = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isSessionLoading: boolean;
  createSession: () => Promise<TChatSession> | any;
  clearChatSessions?: () => Promise<void>;
  currentSession: TChatSession | undefined;
  streamingMessage?: TStreamProps;
  error?: string | undefined;
  runModel: (
    props: PromptProps,
    sessionId: string,
    selectedModel: any
  ) => Promise<void>;
};

export const useChatStore = create<TChatStore>(() => {
  return {
    sessions: [],
    isSessionLoading: false,
    streamingMessage: undefined,
    currentSession: undefined,
    refetchSessions: () => {},
    createSession: () => {},
    runModel: async () => {},
  };
});
