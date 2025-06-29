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

export const useLLM = ({ onStream, onStreamStart, onStreamEnd }: TUseLLM) => {
  const { getSessionById, addMessageToSession } = useChatSession();

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

  const runModel = async (props: PromptProps, sessionId: string) => {
    const currentSession = await getSessionById(sessionId);

    if (!props?.query) {
      return;
    }

    const apiKey = "";
    // const model = new ChatOpenAI({
    //   model: "gpt-3.5-turbo",
    //   openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
    // });

    // const model = new ChatGoogleGenerativeAI({
    //   model: "gemini-pro",
    //   apiKey: apiKey || process.env.GOOGLE_API_KEY,
    // });

    const model = new ChatOpenAI({
      model: "llama3-70b-8192", // or "llama3-70b-8192", "gemma-7b-it"
      openAIApiKey: apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY,
      configuration: {
        baseURL: "https://api.groq.com/openai/v1",
      },
    });

    const newMessageId = v4();

    const formattedChatPrompt = await preparePrompt(
      props,
      currentSession?.messages || []
    );

    const stream = await model.stream(formattedChatPrompt);

    let streamedMessage = "";

    onStreamStart();

    for await (const chunk of stream) {
      streamedMessage += chunk.content;
      onStream({ props, sessionId, message: streamedMessage });
    }

    const chatMessage = {
      id: newMessageId,
      model: ModelType.LLAMA3_70b,
      human: new HumanMessage(props.query),
      ai: new AIMessage(streamedMessage),
      rawHuman: props.query,
      rawAI: streamedMessage,
      props,
    };

    addMessageToSession(sessionId, chatMessage).then(() => {
      onStreamEnd();
    });
  };

  return {
    runModel,
  };
};
