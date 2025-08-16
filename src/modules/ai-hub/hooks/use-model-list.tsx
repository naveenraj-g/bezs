import { ChatOpenAI } from "@langchain/openai";
import {
  selectedModel,
  useSelectedModelStore,
} from "../stores/useSelectedModelStore";
import { useEffect, useRef } from "react";

export const useModelList = () => {
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  const defaultPreferences = useSelectedModelStore(
    (state) => state.defaultModelPreferences
  );

  const selectedModelRef = useRef<selectedModel | null>(null);

  useEffect(() => {
    if (selectedModel) {
      selectedModelRef.current = selectedModel;
    }
  }, [selectedModel]);

  const createInstance = async (model: string) => {
    const temperature =
      selectedModel?.temperature || defaultPreferences.temperature;
    const topP = selectedModel?.topP || defaultPreferences.topP;
    const topK = selectedModel?.topK || defaultPreferences.topK;
    const maxTokens = selectedModel?.maxToken || defaultPreferences.maxToken;
    console.log(selectedModel);
    return new ChatOpenAI({
      model: selectedModelRef.current!.id!,
      apiKey: "dummy",
      streaming: true,
      configuration: {
        baseURL: `${window.location.origin}/api/groq`,
      },
      temperature,
      topP,
      maxTokens,
    });
  };

  return {
    createInstance,
  };
};
