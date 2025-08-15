import { get, set } from "idb-keyval";
import { TModelKey, TBaseModel } from "./use-model-list";
import { TToolKey } from "./use-tools";

export type TApiKeys = Partial<Record<TBaseModel, string>>;
// 11:25
export type TPreferences = {
  // defaultModel: TModelKey;
  systemPrompt?: string;
  messageLimit: number | "all";
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  googleSearchEngineId?: string;
  googleSearchApiKey?: string;
  defaultPlugins: TToolKey[];
};

export const defaultPreferences: TPreferences = {
  // defaultModel: "llama3-70b-8192",
  systemPrompt: "You are a helpful assistant.",
  messageLimit: "all",
  temperature: 0.5,
  topP: 1.0,
  topK: 5,
  maxTokens: 1000,
  defaultPlugins: [],
};

export const usePreferences = () => {
  const getApiKeys = async (): Promise<TApiKeys> => {
    return (await get("api-keys")) || {};
  };

  const getPreferences = async (): Promise<TPreferences> => {
    return (await get("preferences")) || defaultPreferences;
  };

  const setPreferences = async (preferences: Partial<TPreferences>) => {
    const currentPreferences = await getPreferences();
    const newPreferences = { ...currentPreferences, ...preferences };
    await set("preferences", newPreferences);
  };

  const resetToDefaults = async () => {
    await set("preferences", defaultPreferences);
  };

  const setApiKey = async (key: TBaseModel, value: string) => {
    const keys = get("api-keys");
    const newKeys = { ...keys, [key]: value };
    await set("api-keys", newKeys);
  };

  const getApiKey = async (key: TBaseModel) => {
    const keys = await getApiKeys();
    return keys[key];
  };

  return {
    getApiKeys,
    setApiKey,
    getApiKey,
    getPreferences,
    setPreferences,
    resetToDefaults,
  };
};
