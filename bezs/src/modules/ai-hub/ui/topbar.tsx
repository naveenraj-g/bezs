"use client";

import { Button } from "@/components/ui/button";
// import { useChatStore } from "../stores/useChatStore";
import { useParams, useRouter } from "next/navigation";
import { HistoryIcon, Plus, Settings, SquarePen } from "lucide-react";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useFilterStore } from "../stores/useFilterStore";
import { useChatContext } from "../context/chat/context";

export const Topbar = () => {
  // const { sessions, createSession } = useChatStore();
  const { createSession } = useChatContext();
  const router = useRouter();
  const params = useParams();
  const openSettings = useSettingsStore((state) => state.open);
  const openChatHistory = useFilterStore((state) => state.open);

  async function handleCreateSession() {
    const newSession = await createSession();

    if (newSession[0]?.id) {
      router.push(`/bezs/ai-hub/ask-ai/${newSession[0].id}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Button size="sm" variant="outline" onClick={handleCreateSession}>
          <SquarePen /> New Chat
        </Button>
        <Button size="sm" variant="outline" onClick={openSettings}>
          <Settings className="w-4 h-4" /> Settings
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Button size="sm" variant="outline" onClick={openChatHistory}>
          <HistoryIcon className="w-4 h-4" /> History{" "}
          <span className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded-md text-xs">
            Ctrl K
          </span>
        </Button>
      </div>
    </div>
  );
};
