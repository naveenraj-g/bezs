import { create } from "zustand";
import { TSettingsMenuItem } from "../types/settings-type";
import { GroqLlama3Settings } from "../ui/settings/groq-llama3";
import { GearSixIcon } from "@phosphor-icons/react";
import { ModelIcon } from "../ui/icons/model-icon";
import { GeminiSettings } from "../ui/settings/gemini";

export type TSettingsStore = {
  isSettingOpen: boolean;
  selectedMenu: string;
  settingMenu: TSettingsMenuItem[];
  modelsMenu: TSettingsMenuItem[];
  getAllMenu: () => TSettingsMenuItem[];
  open: () => void;
  dismiss: () => void;
  setSelectedMenu: (menu: string) => void;
};

export const useSettingsStore = create<TSettingsStore>((set, get) => {
  return {
    isSettingOpen: false,
    selectedMenu: "profile",
    settingMenu: [
      {
        name: "Profile",
        key: "profile",
        icon: () => <GearSixIcon size={16} weight="bold" />,
        component: <div>Profile</div>,
      },
      {
        name: "Prompts",
        key: "prompts",
        icon: () => <GearSixIcon size={16} weight="bold" />,
        component: <div>Prompts</div>,
      },
      {
        name: "Roles",
        key: "roles",
        icon: () => <GearSixIcon size={16} weight="bold" />,
        component: <div>Roles</div>,
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
    getAllMenu() {
      const { settingMenu, modelsMenu } = get();
      return [...settingMenu, ...modelsMenu];
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
