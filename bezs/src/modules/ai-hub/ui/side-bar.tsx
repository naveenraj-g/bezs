import { useState } from "react";
import { Drawer } from "vaul";
import { useChatContext } from "../context/chat/context";
import { useRouter } from "next/navigation";
import { useChatSession } from "../hooks/use-chat-session";
import { Button } from "@/components/ui/button";
import { PlusIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash2 } from "lucide-react";

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
                <Drawer.Title className="text-sm text-zinc-500 dark:text-zinc-400">
                  Recent History
                </Drawer.Title>
              </div>
              {sortSessions(sessions, "updatedAt")?.map((session) => {
                return (
                  <div
                    key={session.id}
                    className={cn(
                      "w-full p-2 rounded-xl hover:bg-black/10 hover:dark:bg-black/15 flex gap-2 items-center group",
                      currentSession?.id === session.id
                        ? "bg-black/10 dark:bg-black/30"
                        : ""
                    )}
                  >
                    <Link
                      href={`/bezs/ai-hub/ask-ai/${session.id}`}
                      className="inline-block w-full truncate text-xs md:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      {session.title}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-fit p-0 hover:!bg-transparent relative"
                        >
                          <Ellipsis className="shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="absolute z-[910] right-[-30px]"
                        align="center"
                      >
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={async () => {
                            await removeSession(session.id);

                            setTimeout(() => {
                              router.push("/bezs/ai-hub/ask-ai");
                            }, 100);
                          }}
                        >
                          <Trash2 className="text-red-500" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
