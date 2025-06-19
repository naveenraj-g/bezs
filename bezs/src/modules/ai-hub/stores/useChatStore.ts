import { create } from "zustand";
import { TChatSession } from "../hooks/use-chat-session";

export type TChatStore = {
  chatSession: TChatSession[];
};

export const useChatStore = create<TChatStore | undefined>((set) => ({
  chatSession: [],
}));
