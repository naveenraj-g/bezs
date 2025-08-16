import {
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { useChatSession } from "./use-chat-session";
import { v4 } from "uuid";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  PromptProps,
  TChatMessage,
  TRunModel,
  TUseLLM,
} from "../types/chat-types";
import { useModelList } from "./use-model-list";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import moment from "moment";
import type { Serialized } from "@langchain/core/load/serializable";
import { LLMResult } from "@langchain/core/outputs";
import { toast } from "sonner";
import { useTools } from "./use-tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { usePreferences } from "./use-preferences";
import { Assistant } from "../../../../prisma/generated/ai-hub";
import {
  addMessageToSessionDB,
  getSessionById,
  updateSessionTitle,
} from "../serveractions/session-server-actions";

export const useLLM = ({ onChange }: TUseLLM) => {
  const { sortMessages } = useChatSession();
  const { createInstance } = useModelList();
  const selectedModelData = useSelectedModelStore(
    (state) => state.selectedModel
  );
  const defaultPreferences = useSelectedModelStore(
    (state) => state.defaultModelPreferences
  );

  const { getPreferences } = usePreferences();
  const abortController = new AbortController();
  const { getToolByKey } = useTools();

  const stopGeneration = () => {
    abortController?.abort();
  };

  const preparePrompt = async (
    props: PromptProps,

    history: TChatMessage[],
    assistant?: Assistant
  ) => {
    const hasPreviousMessages = history?.length > 0;
    const systemPrompt =
      assistant?.prompt ||
      selectedModelData?.defaultPrompt ||
      defaultPreferences.defaultPrompt;

    const system: BaseMessagePromptTemplateLike = [
      "system",
      `${systemPrompt}. ${
        props?.context
          ? `Answer user's question based on the following context: """{context}"""`
          : ""
      } ${hasPreviousMessages ? `You can also refer to these pervious conversations` : ""}`,
    ];

    const messageHolders = new MessagesPlaceholder("chat_history");

    const userContext = `{input}`;

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
      ["placeholder", "{agent_scratchpad}"],
    ]);

    return prompt;
  };

  const runModel = async ({
    role,
    type,
    context,
    image,
    query,
    sessionId,
    messageId,
    selectedModel,
    selectedAssistant,
  }: TRunModel) => {
    const [data] = await getSessionById({ sessionId: sessionId.toString() });
    const currentSession = data?.session;

    const props = {
      role,
      type,
      context,
      image,
      query,
    };

    // console.log({ props });

    // console.log({ messageId, query, props });

    if (!query) {
      return;
    }

    const newMessageId = messageId || v4();

    const preferences = await getPreferences();
    const allPreviousMessages =
      currentSession?.messages?.filter((m) => m.id !== messageId) || [];
    const chatHistory = sortMessages(allPreviousMessages, "createdAt");
    const messageLimit =
      selectedModelData?.messageLimit || defaultPreferences.messageLimit;
    const plugins = preferences.defaultPlugins || [];

    const defaultChangeProps = {
      id: newMessageId,
      role,
      type,
      context,
      image,
      query,
      model: selectedModel?.displayName,
      isGoodResponse: false,
      sessionId,
      rawHuman: query,
      createdAt: moment().toISOString(),
    };

    onChange?.({
      ...defaultChangeProps,
      isLoading: true,
    });

    if (!selectedModel) {
      onChange?.({
        ...defaultChangeProps,
        hasError: true,
        isLoading: false,
        errorMessage: "Model not found",
      });
      return;
    }

    try {
      const model = await createInstance(selectedModel.modelName!);

      const prompt = await preparePrompt(
        props,
        currentSession?.messages?.filter((m) => m.id !== messageId) || [],
        selectedAssistant ?? undefined
      );

      const previousAllowedChatHistory = chatHistory
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

      const availableTools =
        selectedModelData?.plugins
          ?.filter((p) => {
            return plugins.includes(p);
          })
          ?.map((p) => getToolByKey(p)?.(preferences))
          ?.filter((t): t is any => !!t) || [];

      console.log("available tools", availableTools);

      const agentWithTool = await createToolCallingAgent({
        llm: model as any,
        tools: availableTools,
        prompt: prompt as any,
        streamRunnable: true,
      });

      const agentExecutor = new AgentExecutor({
        agent: agentWithTool,
        tools: availableTools,
      });

      const chainWithoutTools = prompt.pipe(model as any);

      let streamedMessage = "";
      let toolName: string | undefined;

      const promptValue = await prompt.formatPromptValue({
        chat_history: previousAllowedChatHistory || [],
        context: props.context,
        input: props.query,
      });

      console.log("pm", promptValue.toString());

      const stream: any = await (
        !!availableTools?.length ? agentExecutor : chainWithoutTools
      ).invoke(
        {
          chat_history: previousAllowedChatHistory || [],
          context: props.context,
          input: props.query,
        },
        {
          callbacks: [
            {
              handleLLMStart: async (llm: Serialized, prompts: string[]) => {
                console.log("LLM Start");
                onChange?.({
                  ...defaultChangeProps,
                  rawAI: streamedMessage,
                  isLoading: true,
                  isToolRunning: false,
                  hasError: false,
                  toolName,
                  errorMessage: undefined,
                  createdAt: moment().toISOString(),
                });
              },
              handleToolStart(
                tool,
                input,
                runId,
                parentRunId,
                tags,
                metadata,
                name
              ) {
                console.log(
                  "tool start",
                  tool,
                  input,
                  runId,
                  parentRunId,
                  tags,
                  metadata,
                  name
                );
                toolName = name;
                onChange?.({
                  ...defaultChangeProps,
                  toolName: name,
                  isToolRunning: true,
                });
              },
              handleToolEnd(output, runId, parentRunId, tags) {
                onChange?.({
                  ...defaultChangeProps,
                  isToolRunning: false,
                  toolName,
                  toolResult: output,
                });
              },
              handleAgentAction(action, runId, parentRunId, tags) {
                console.log("agent action", action);
              },
              handleLLMEnd: async (output: LLMResult) => {
                console.log("LLM End", output);
              },
              handleLLMNewToken: async (token: string) => {
                console.log("token", token);
                streamedMessage += token;
                onChange?.({
                  ...defaultChangeProps,
                  isLoading: true,
                  rawAI: streamedMessage,
                  toolName,
                  hasError: false,
                  errorMessage: undefined,
                });
              },
              handleChainEnd: async (output: LLMResult) => {
                console.log("chain end", output);
              },
              handleLLMError: async (err: Error) => {
                console.error(err);
                toast.error("Error!", {
                  description: "Something went wrong.",
                });

                onChange?.({
                  ...defaultChangeProps,
                  hasError: true,
                  isLoading: false,
                  errorMessage: "Something went wrong",
                });
              },
            },
          ],
        }
      );

      const chatMessageForDB = {
        id: newMessageId,
        sessionId: sessionId,
        model: selectedModel.displayName!,
        rawHuman: props.query!,
        rawAI: stream?.content || stream?.output,
        toolName,
        context: props.context,
        image: props.image,
        role: props.role,
        type: props.type,
        query: props.query!,
      };

      await addMessageToSessionDB(chatMessageForDB);

      const chatMessage: TChatMessage = {
        ...defaultChangeProps,
        id: newMessageId,
        rawHuman: props.query,
        model: selectedModel.displayName!,
        rawAI: stream?.content || stream?.output,
        isToolRunning: false,
        toolName,
        isLoading: false,
        hasError: false,
        createdAt: moment().toISOString(),
      };

      await generateTitleForSession(sessionId, selectedModel.modelName!);
      await onChange?.(chatMessage);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      console.log(e);
      toast.error("Error!", {
        description: "Something went wrong.",
      });
      onChange?.({
        ...defaultChangeProps,
        rawHuman: props.query,
        hasError: true,
        isLoading: false,
        errorMessage: "Something went wrong on generating response.",
        createdAt: moment().toISOString(),
      });
    }
  };

  const generateTitleForSession = async (
    sessionId: string,
    selectedModel: string
  ) => {
    const [data] = await getSessionById({ sessionId });

    const session = data?.session;

    if (!selectedModel) {
      throw new Error("Model not found");
    }

    const model = await createInstance(selectedModel);

    console.log("title session", session);

    const firstMessage = session?.messages?.[0];

    if (!firstMessage || !firstMessage.rawAI || !firstMessage.rawHuman) {
      return;
    }

    const template = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("message"),
      [
        "user",
        "Make this prompt clear and concise? You must strictly answer with only the title, no other text is allowed.\n\nAnswer in English.",
      ],
    ]);

    try {
      const prompt = await template.formatMessages({
        message: [new HumanMessage(firstMessage.rawHuman)],
      });

      const generation = await model.invoke(prompt, {});
      console.log("title generation", generation);
      const newTitle = generation?.content?.toString() || session.title;

      await updateSessionTitle({
        sessionId,
        title: newTitle?.toString() || "Untitled",
      });
    } catch (err) {
      console.log(err);
      return firstMessage?.rawHuman;
    }
  };

  return {
    runModel,
    stopGeneration,
    generateTitleForSession,
  };
};
