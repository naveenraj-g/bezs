import { create } from "zustand";
import { PromptProps, TChatSession, TStreamProps } from "../types/chat-types";

export type TChatStore = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isSessionLoading: boolean;
  createSession: () => void;
  lastStream?: TStreamProps;
  runModel: (props: PromptProps, sessionId: string) => Promise<void>;
};

export const useChatStore = create<TChatStore>(() => {
  return {
    sessions: [],
    isSessionLoading: false,
    lastStream: undefined,
    refetchSessions: () => {},
    createSession: () => {},
    runModel: async () => {},
  };
});
