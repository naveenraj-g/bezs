import {
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
  ModelType,
  PromptProps,
  TChatMessage,
  TUseLLM,
} from "../types/chat-types";
import { usePreferences } from "./use-preferences";
import { useModelList } from "./use-model-list";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import moment from "moment";

export const useLLM = ({
  onInit,
  onStream,
  onStreamStart,
  onStreamEnd,
  onError,
}: TUseLLM) => {
  const { getSessionById, addMessageToSession } = useChatSession();
  const { getApiKey, getPreferences } = usePreferences();
  const { createInstance, getModelByKey } = useModelList();
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);

  const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
    const messageHistory = history;
    const prompt = ChatPromptTemplate.fromMessages(
      messageHistory?.length > 0
        ? [
            [
              "system",
              "You are {role}. Answer user's question based on the following context:",
            ],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
          ]
        : [
            props?.context
              ? [
                  "system",
                  "You are {role} Answer user's question based on the following context: {context}",
                ]
              : ["system", "You are {role}. {type}"],
            ["user", "{input}"],
          ]
    );

    const previousMessageHistory = messageHistory.reduce(
      (acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman }) => [
        ...acc,
        new HumanMessage(rawHuman),
        new AIMessage(rawAI),
      ],
      []
    );

    return await prompt.formatMessages(
      messageHistory?.length > 0
        ? {
            role: getRole(props.role),
            chat_history: previousMessageHistory,
            input: props.query,
          }
        : {
            role: getRole(props.role),
            type: getInstruction(props.type),
            context: props.context,
            input: props.query,
          }
    );
  };

  const runModel = async (
    props: PromptProps,
    sessionId: string,
    selectedModel: any
  ) => {
    const currentSession = await getSessionById(sessionId);

    if (!props?.query) {
      return;
    }

    const preferences = await getPreferences();
    const modelKey = preferences.defaultModel;

    onInit({ props, model: modelKey, sessionId, loading: true });

    // const selectedModel = getModelByKey(modelKey);

    // eslint-disable-next-line react-hooks/rules-of-hooks

    if (!selectedModel) {
      throw new Error("Model not found.");
    }

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
      const newMessageId = v4();
      // const model = new ChatOpenAI({
      //   model: "llama3-70b-8192", // or "llama3-70b-8192", "gemma-7b-it"
      //   openAIApiKey: apiKey,
      //   configuration: {
      //     baseURL: "https://api.groq.com/openai/v1",
      //   },
      // });

      const model = await createInstance(selectedModel);

      const formattedChatPrompt = await preparePrompt(
        props,
        currentSession?.messages || []
      );

      const stream = await model.stream(formattedChatPrompt, {
        options: {
          stream: true,
        },
      });

      if (!stream) {
        return;
      }

      let streamedMessage = "";

      onStreamStart({
        props,
        sessionId,
        message: streamedMessage,
        model: modelKey,
        loading: true,
      });

      for await (const chunk of stream) {
        streamedMessage += chunk.content;
        onStream({
          props,
          sessionId,
          message: streamedMessage,
          model: modelKey,
          loading: true,
        });
      }

      const chatMessage: TChatMessage = {
        id: newMessageId,
        model: selectedModel.modelName,
        human: new HumanMessage(props.query),
        ai: new AIMessage(streamedMessage),
        rawHuman: props.query,
        rawAI: streamedMessage,
        props,
        createdAt: moment().toISOString(),
      };

      addMessageToSession(sessionId, chatMessage).then(() => {
        onStreamEnd({
          props,
          sessionId,
          message: streamedMessage,
          model: modelKey,
          loading: false,
        });
      });
    } catch (e: any) {
      onError({
        props,
        sessionId,
        model: modelKey,
        error: e?.error?.error?.message || e?.error?.message,
        loading: false,
      });
    }
  };

  return {
    runModel,
  };
};
