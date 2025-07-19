import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JSX } from "react";
import { ModelIcon } from "../ui/icons/model-icon";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";

export type TBaseModel = "openai" | "anthropic" | "gemini" | "groqllama3";

export type TModelKey =
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0125"
  | "claude-3-opus-20240299"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307"
  | "llama3-70b-8192"
  | "gemini-pro"
  | "gemini-1.5-pro-latest";

export type TModel = {
  id: string;
  displayName: string | null;
  modelName: string | null;
};

export const useModelList = () => {
  const modelPreferences = useSelectedModelStore(
    (state) => state.modelPreferences
  );

  const createInstance = async (model: TModel) => {
    /*
    switch (model.baseModel) {
      case "openai":
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey,
        });
      case "anthropic":
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey,
        });
      case "gemini":
        return new ChatGoogleGenerativeAI({
          model: model.key,
          streaming: true,
          apiKey,
        });
      case "groqllama3":
        return new ChatOpenAI({
          model: model.key,
          apiKey: "dummy",
          streaming: true,
          configuration: {
            baseURL: `${window.location.origin}/api/groqllama3`,
            // baseURL: `https://api.groq.com/openai/v1`,
          },
        });
      default:
        throw new Error("Invalid model");
    }
        */

    return new ChatOpenAI({
      model: model.modelName!,
      apiKey: "dummy",
      streaming: true,
      configuration: {
        baseURL: `${window.location.origin}/api/groqllama3`,
        // baseURL: `https://api.groq.com/openai/v1`,
      },
      temperature: modelPreferences.temperature,
      topP: modelPreferences.topP,
      maxTokens: modelPreferences.maxTokens,
    });
  };

  const models: TModel[] = [
    {
      name: "Groq llama3",
      key: "llama3-70b-8192",
      tokens: 130000,
      icon: () => <ModelIcon size="md" type="groqllama3" />,
      baseModel: "groqllama3",
    },
    {
      name: "Gemini Pro 1.5",
      key: "gemini-1.5-pro-latest",
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="gemini" />,
      baseModel: "gemini",
    },
    {
      name: "Gemini Pro",
      key: "gemini-pro",
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="gemini" />,
      baseModel: "gemini",
    },
  ];

  const getModelByKey = (key: TModelKey) => {
    return models.find((model) => model.key === key);
  };

  return {
    models,
    createInstance,
    getModelByKey,
  };
};
