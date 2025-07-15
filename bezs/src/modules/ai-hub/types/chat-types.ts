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
  regenerate?: boolean;
};

export type TChatMessage = {
  id: string;
  model: TModelKey;
  human: HumanMessage;
  ai: AIMessage;
  rawHuman: string;
  rawAI: string;
  props?: PromptProps;
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

export type TStreamProps = {
  props: PromptProps;
  model: TModelKey;
  sessionId: string;
  message?: string;
  loading?: boolean;
  error?: string;
};

export type TUseLLM = {
  onInit: (props: TStreamProps) => Promise<void>;
  onStreamStart: (props: TStreamProps) => Promise<void>;
  onStream: (props: TStreamProps) => Promise<void>;
  onStreamEnd: (props: TStreamProps) => Promise<void>;
  onError: (props: TStreamProps) => Promise<void>;
};
