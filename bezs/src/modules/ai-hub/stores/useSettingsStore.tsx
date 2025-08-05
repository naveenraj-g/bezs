import { create } from "zustand";
import { TSettingsMenuItem } from "../types/settings-type";
import { GroqLlama3Settings } from "../ui/settings/groq-llama3";
import {
  ChatCenteredIcon,
  DatabaseIcon,
  GearSixIcon,
  MicrophoneIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { ModelIcon } from "../ui/icons/model-icon";
import { GeminiSettings } from "../ui/settings/gemini";
import { CommonSettings } from "../ui/settings/common";
import { Data } from "../ui/settings/data";
import { VoiceInput } from "../ui/settings/voice-input";
import { WebSearchPlugin } from "../ui/settings/plugins/web-search";

export type TSettingsStore = {
  isSettingOpen: boolean;
  selectedMenu: string;
  settingMenu: TSettingsMenuItem[];
  modelsMenu: TSettingsMenuItem[];
  pluginsMenu: TSettingsMenuItem[];
  getAllMenu: () => TSettingsMenuItem[];
  open: () => void;
  dismiss: () => void;
  setSelectedMenu: (menu: string) => void;
};

export const useSettingsStore = create<TSettingsStore>((set, get) => {
  return {
    isSettingOpen: false,
    selectedMenu: "common",
    settingMenu: [
      {
        name: "Common",
        key: "common",
        icon: () => <GearSixIcon size={16} weight="bold" />,
        component: <CommonSettings />,
      },
      {
        name: "Voice Input",
        key: "voice-input",
        icon: () => <MicrophoneIcon size={16} weight="bold" />,
        component: <VoiceInput />,
      },
      {
        name: "Data",
        key: "your-data",
        icon: () => <DatabaseIcon size={16} weight="bold" />,
        component: <Data />,
      },
    ],
    modelsMenu: [
      {
        name: "OpenAI",
        key: "open-ai",
        icon: () => <ModelIcon size="md" type="openai" />,
        component: <div>OpenAI</div>,
      },
      {
        name: "Anthropic",
        key: "anthropic",
        icon: () => <ModelIcon size="md" type="anthropic" />,
        component: <div>Anthropic</div>,
      },
      {
        name: "Gemini",
        key: "gemini",
        icon: () => <ModelIcon size="md" type="gemini" />,
        component: <GeminiSettings />,
      },
      {
        name: "Groq llama3",
        key: "groq llama3",
        icon: () => <ModelIcon size="md" type="groqllama3" />,
        component: <GroqLlama3Settings />,
      },
    ],
    pluginsMenu: [
      {
        name: "Web Search",
        key: "web-search",
        icon: () => <ModelIcon size="md" type="websearch" />,
        component: <WebSearchPlugin />,
      },
    ],
    getAllMenu() {
      const { settingMenu, modelsMenu, pluginsMenu } = get();
      return [...settingMenu, ...modelsMenu, ...pluginsMenu];
    },
    open() {
      set({ isSettingOpen: true });
    },
    dismiss() {
      set({ isSettingOpen: false });
    },
    setSelectedMenu(menu) {
      set({ selectedMenu: menu });
    },
  };
});
