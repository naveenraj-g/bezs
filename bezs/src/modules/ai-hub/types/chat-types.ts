import { AIMessage, HumanMessage } from "@langchain/core/messages";

export enum ModelType {
  GPT3 = "gpt-3",
  GPT4 = "gpt-4",
  CLAUDE2 = "claude-2",
  CLAUDE3 = "claude-3",
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
  writing_export = "writing_export",
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
  model: ModelType;
  human: HumanMessage;
  ai: AIMessage;
  rawHuman: string;
  rawAI: string;
  props?: PromptProps;
  createdAt?: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
};

export type TStreamProps = {
  props: PromptProps;
  sessionId: string;
  message: string;
};

export type TUseLLM = {
  onStreamStart: () => void;
  onStream: (props: TStreamProps) => Promise<void>;
  onStreamEnd: () => void;
};
