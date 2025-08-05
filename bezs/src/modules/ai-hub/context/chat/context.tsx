"use client";

import { createContext, useContext } from "react";
import { TChatSession, TRunModel } from "../../types/chat-types";

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  currentSession: TChatSession | undefined;
  createSession: () => Promise<TChatSession> | any;
  removeSession: (sessionId: string) => Promise<void>;
  clearChatSessions: () => Promise<void>;
  stopGeneration: () => void;
  runModel: (props: TRunModel) => Promise<void>;
  removeMessage: (messageId: string) => void;
  error?: string | undefined;

  initialPrompt?: string;
  setInitialPrompt: (query: string | undefined) => void;
};

export const ChatContext = createContext<TChatContext | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
