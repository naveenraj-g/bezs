import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { TModelKey } from "../hooks/use-model-list";

export enum ModelType {
  GPT3 = "gpt-3",
  GPT4 = "gpt-4",
  CLAUDE2 = "claude-2",
  CLAUDE3 = "claude-3",
  LLAMA3_70b = "llama3-70b",
}

export enum PromptType {
  ask = "ask",
  answer = "answer",
  explain = "explain",
  summarize = "summarize",
  improve = "improve",
  fix_grammer = "fix_grammer",
  reply = "reply",
  short_reply = "short_reply",
}

export enum RoleType {
  assistant = "assistant",
  writing_export = "writing_expert",
  social_media_expert = "social_media_expert",
}

export type PromptProps = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  image?: string;
};

export type TChatMessage = {
  id: string;
  model?: string;
  rawHuman?: string;
  rawAI?: string;
  sessionId: string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  props?: PromptProps;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type TUseLLM = {
  onInit: (props: TChatMessage) => Promise<void>;
  onStreamStart: (props: TChatMessage) => Promise<void>;
  onStream: (props: TChatMessage) => Promise<void>;
  onStreamEnd: (props: TChatMessage) => Promise<void>;
  onError: (props: TChatMessage) => Promise<void>;
};

export type TRunModel = {
  props: PromptProps;
  sessionId: string;
  messageId?: string;
  selectedModel?: string;
};
