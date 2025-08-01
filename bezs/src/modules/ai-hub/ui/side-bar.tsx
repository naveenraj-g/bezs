import { useState } from "react";
import { Drawer } from "vaul";
import { useChatContext } from "../context/chat/context";
import { useRouter } from "next/navigation";
import { useChatSession } from "../hooks/use-chat-session";
import { Button } from "@/components/ui/button";
import { PlusIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";

export const HistorySidebar = () => {
  const [open, setOpen] = useState(false);
  const {
    sessions,
    createSession,
    clearChatSessions,
    removeSession,
    currentSession,
  } = useChatContext();
  const router = useRouter();
  const { sortSessions } = useChatSession();

  async function handleCreateSession() {
    const newSession = await createSession();

    if (newSession[0]?.id) {
      setOpen(false);
      router.push(`/bezs/ai-hub/ask-ai/${newSession[0].id}`);
    }
  }

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          <SidebarSimpleIcon size={16} weight="bold" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[900] bg-zinc-500/70 dark:bg-zinc-900/70 backdrop-blur-sm" />
        <Drawer.Content
          className={cn(
            "flex flex-col rounded-3xl outline-none w-[280px] fixed z-[901] md:bottom-2 right-2 top-2"
          )}
        >
          <div className="bg-white dark:bg-zinc-700 dark:border dark:border-white/5 flex rounded-2xl flex-1 p-2 relative">
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  <SidebarSimpleIcon size={20} weight="bold" />
                </Button>
                <div className="relative">
                  <ActionTooltipProvider
                    label="New Chat"
                    side="left"
                    align="center"
                    className="absolute z-[902] -left-[78px] -top-[14px]"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCreateSession}
                    >
                      <PlusIcon size={20} weight="bold" />
                    </Button>
                  </ActionTooltipProvider>
                </div>
              </div>
              <div className="p-2 mt-2">
                <p className="text-sm text-zinc-500">Recent History</p>
              </div>
              {sortSessions(sessions, "updatedAt")?.map((session) => {
                return (
                  <div
                    key={session.id}
                    className={cn(
                      "w-full cursor-pointer p-2 rounded-xl hover:bg-black/10 hover:dark:bg-black/15",
                      currentSession?.id === session.id
                        ? "bg-black/10 dark:bg-black/30"
                        : ""
                    )}
                  >
                    <p className="w-full truncate text-xs md:text-sm">
                      {session.title}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col h-full justify-center items-center absolute left-[-20px] w-4">
              <div className="w-1 h-4 shrink-0 rounded-full bg-white/50 mb-4" />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
