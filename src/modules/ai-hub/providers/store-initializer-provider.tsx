"use client";

import { useInitChatStore } from "../hooks/init-store-hooks/use-init-chat-store";

export const StoreInitializerProvider = () => {
  useInitChatStore();

  return null;
};
