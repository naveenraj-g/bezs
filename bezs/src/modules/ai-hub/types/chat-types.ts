import { Assistant } from "../../../../prisma/generated/ai-hub";

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
  query: string;
  image?: string;
};

export type TChatMessage = {
  id: string;
  model?: string | null;
  rawHuman?: string | null;
  rawAI?: string | null;
  sessionId: string;
  toolName?: string | null;
  toolResult?: string | null;
  isToolRunning?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string | null;
  isGoodResponse?: boolean | null;
  type: PromptType | null;
  context?: string;
  role: RoleType;
  query: string;
  image?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type TUseLLM = {
  onChange?: (props: TChatMessage) => void;
};

export type TRunModel = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  image?: string;
  sessionId: string;
  messageId?: string;
  selectedModel?: string;
  selectedAssistant?: Assistant;
};
