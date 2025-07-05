import { create } from "zustand";
import { PromptProps, TChatSession, TStreamProps } from "../types/chat-types";

export type TChatStore = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isSessionLoading: boolean;
  createSession: () => Promise<TChatSession> | any;
  currentSession: TChatSession | undefined;
  streamingMessage?: TStreamProps;
  error?: string | undefined;
  runModel: (props: PromptProps, sessionId: string) => Promise<void>;
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
