import {
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { useChatSession } from "./use-chat-session";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroqInput } from "@langchain/groq";
import { v4 } from "uuid";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getInstruction, getRole } from "../lib/prompts";
import {
  PromptProps,
  TChatMessage,
  TRunModel,
  TUseLLM,
} from "../types/chat-types";
import { usePreferences } from "./use-preferences";
import { useModelList } from "./use-model-list";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import moment from "moment";
import type { Serialized } from "@langchain/core/load/serializable";
import { LLMResult } from "@langchain/core/outputs";

export const useLLM = ({
  onInit,
  onStream,
  onStreamStart,
  onStreamEnd,
  onError,
}: TUseLLM) => {
  const { getSessionById, addMessageToSession, sortMessages } =
    useChatSession();
  const { getApiKey, getPreferences } = usePreferences();
  const { createInstance, getModelByKey } = useModelList();
  const modelPreferences = useSelectedModelStore(
    (state) => state.modelPreferences
  );

  const defaultModelPreferences = useSelectedModelStore(
    (state) => state.defaultModelPreferences
  );
  const abortController = new AbortController();

  const stopGeneration = () => {
    abortController?.abort();
  };

  const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
    const messageLimit = modelPreferences.messageLimit;
    const hasPreviousMessages = history?.length > 0;
    const systemPrompt = modelPreferences.systemPrompt;

    const system: BaseMessagePromptTemplateLike = [
      "system",
      `${systemPrompt}.`,
    ];

    const messageHolders = new MessagesPlaceholder("chat_history");

    const userContext = `{input} ${
      props?.context
        ? `Answer user's question based on the following context: """{context}"""`
        : ""
    } ${hasPreviousMessages ? `You can also refer this pervious conversations if needed.` : ""}`;

    const user: BaseMessagePromptTemplateLike = [
      "user",
      props?.image
        ? [
            {
              type: "text",
              text: userContext,
            },
            {
              type: "image_url",
              image_url: props.image,
            },
          ]
        : userContext,
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      system,
      messageHolders,
      user,
    ]);

    const previousMessageHistory = sortMessages(history, "createdAt")
      .slice(0, messageLimit === "all" ? history.length : messageLimit)
      .reduce(
        (acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman, image }) => {
          if (rawAI && rawHuman) {
            return [...acc, new HumanMessage(rawHuman), new AIMessage(rawAI)];
          } else {
            return [...acc];
          }
        },
        []
      );

    // prompt.format({
    //   chat_history: previousMessageHistory || [],
    //   context: props.context,
    //   input: props.query,
    // });

    // const formattedChatPrompt = await prompt.formatMessages({
    //   chat_history: previousMessageHistory || [],
    //   context: props.context,
    //   input: props.query,
    // });

    return prompt;
  };

  const runModel = async ({
    props,
    sessionId,
    messageId,
    selectedModel,
  }: TRunModel) => {
    const currentSession = await getSessionById(sessionId);

    if (!props?.query) {
      return;
    }

    const newMessageId = messageId || v4();
    // const preferences = await getPreferences();
    // const modelKey = preferences.defaultModel;

    // const selectedModel = getModelByKey(modelKey);

    // eslint-disable-next-line react-hooks/rules-of-hooks

    if (!selectedModel) {
      onError({
        id: newMessageId,
        props,
        model: selectedModel ?? undefined,
        sessionId,
        rawHuman: props.query,
        hasError: true,
        isLoading: false,
        errorMessage: "AI Model not found.",
        createdAt: moment().toISOString(),
      });

      return;
    }

    const allPreviousMessages =
      currentSession?.messages?.filter((m) => m.id !== messageId) || [];
    const chatHistory = sortMessages(allPreviousMessages, "createdAt");
    const messageLimit =
      modelPreferences.messageLimit || defaultModelPreferences.messageLimit;

    onInit({
      id: newMessageId,
      props,
      model: selectedModel,
      sessionId,
      rawHuman: props.query,
      createdAt: moment().toISOString(),
      hasError: false,
      isLoading: true,
    });

    // const apiKey = await getApiKey(selectedModel.baseModel);

    // const apiKey = await getApiKey("groqllama3");
    // const model = new ChatOpenAI({
    //   model: "gpt-3.5-turbo",
    //   openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
    // });

    // const model = new ChatGoogleGenerativeAI({
    //   model: "gemini-pro",
    //   apiKey: apiKey || process.env.GOOGLE_API_KEY,
    // });

    try {
      // const model = new ChatOpenAI({
      //   model: "llama3-70b-8192", // or "llama3-70b-8192", "gemma-7b-it"
      //   openAIApiKey: apiKey,
      //   configuration: {
      //     baseURL: "https://api.groq.com/openai/v1",
      //   },
      // });

      const model = await createInstance(selectedModel);
      model.bind({ signal: abortController.signal });
      const formattedChatPrompt = await preparePrompt(
        props,
        currentSession?.messages || []
      );

      const stream = await model.stream(formattedChatPrompt, {
        options: {
          stream: true,
          signal: abortController.signal,
        },
        callbacks: [
          {
            handleLLMStart: async (llm: Serialized, prompts: string[]) => {
              console.log(JSON.stringify(llm, null, 2));
              console.log(JSON.stringify(prompts, null, 2));
            },
            handleLLMEnd: async (output: LLMResult) => {
              console.log(JSON.stringify(output, null, 2));
            },
            handleLLMError: async (err: Error) => {
              console.error(err);
            },
          },
        ],
      });

      if (!stream) {
        return;
      }

      let streamedMessage = "";

      onStreamStart({
        id: newMessageId,
        props,
        sessionId,
        rawHuman: props.query,
        rawAI: streamedMessage,
        model: selectedModel,
        isLoading: true,
        hasError: false,
        createdAt: moment().toISOString(),
      });

      for await (const chunk of stream) {
        streamedMessage += chunk.content;
        onStream({
          id: newMessageId,
          props,
          sessionId,
          rawHuman: props.query,
          rawAI: streamedMessage,
          model: selectedModel,
          isLoading: true,
          hasError: false,
          errorMessage: undefined,
          createdAt: moment().toISOString(),
        });
      }

      const chatMessage: TChatMessage = {
        id: newMessageId,
        sessionId,
        rawHuman: props.query,
        rawAI: streamedMessage,
        props,
        model: selectedModel,
        isLoading: false,
        hasError: false,
        createdAt: moment().toISOString(),
      };

      addMessageToSession(sessionId, chatMessage).then(() => {
        onStreamEnd(chatMessage);
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      onError({
        id: newMessageId,
        props,
        model: selectedModel ?? undefined,
        sessionId,
        rawHuman: props.query,
        hasError: true,
        isLoading: false,
        errorMessage: "Something went wrong on generating response.",
        createdAt: moment().toISOString(),
      });
    }
  };

  return {
    runModel,
    stopGeneration,
  };
};

// 3:05
