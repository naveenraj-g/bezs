import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JSX } from "react";
import { ModelIcon } from "../ui/icons/model-icon";

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
  name: string;
  key: TModelKey;
  icon: () => JSX.Element;
  tokens: number;
  baseModel: TBaseModel;
};

export const useModelList = () => {
  const createInstance = async (model: TModel, apiKey: string) => {
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
          apiKey,
          streaming: true,
          configuration: {
            baseURL: `${window.location.origin}/api/groqllama3`,
          },
        });
      default:
        throw new Error("Invalid model");
    }
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
