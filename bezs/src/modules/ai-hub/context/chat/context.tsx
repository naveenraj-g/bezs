"use client";

import { createContext, useContext } from "react";
import {
  PromptProps,
  TChatSession,
  TStreamProps,
} from "../../types/chat-types";

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  currentSession: TChatSession | undefined;
  createSession: () => Promise<TChatSession> | any;
  removeSession: (sessionId: string) => Promise<void>;
  clearChatSessions: () => Promise<void>;
  streamingMessage?: TStreamProps;
  stopGeneration: () => void;
  runModel: (
    props: PromptProps,
    sessionId: string,
    selectedModel: any
  ) => Promise<void>;
  removeMessage: (messageId: string) => void;
  error?: string | undefined;
};

export const ChatContext = createContext<TChatContext | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
