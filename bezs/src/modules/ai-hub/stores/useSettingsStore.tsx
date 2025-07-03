import { create } from "zustand";
import { TSettingsMenuItem } from "../types/settings-type";
import { GroqLlama3Settings } from "../ui/settings/groq-llama3";

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
        component: <div>Profile</div>,
      },
      {
        name: "Prompts",
        key: "prompts",
        component: <div>Prompts</div>,
      },
      {
        name: "Roles",
        key: "roles",
        component: <div>Roles</div>,
      },
    ],
    modelsMenu: [
      {
        name: "OpenAI",
        key: "open-ai",
        component: <div>OpenAI</div>,
      },
      {
        name: "Anthropic",
        key: "anthropic",
        component: <div>Anthropic</div>,
      },
      {
        name: "Gemini",
        key: "gemini",
        component: <div>Gemini</div>,
      },
      {
        name: "Groq llama3",
        key: "groq llama3",
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
