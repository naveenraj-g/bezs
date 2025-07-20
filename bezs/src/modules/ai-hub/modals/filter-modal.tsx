"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFilterStore } from "../stores/useFilterStore";
// import { useChatStore } from "../stores/useChatStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TChatSession } from "../types/chat-types";
import {
  ChatIcon,
  EraserIcon,
  PlusIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useChatSession } from "../hooks/use-chat-session";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { useChatContext } from "../context/chat/context";

export const FilterModal = () => {
  const router = useRouter();

  const isFilterOpen = useFilterStore((state) => state.isFilterOpen);
  const toggleFilter = useFilterStore((state) => state.toggleFilter);
  const filterClose = useFilterStore((state) => state.dismiss);
  // const sessions = useChatStore((state) => state.sessions);
  // const createSession = useChatStore((state) => state.createSession);
  // const clearChatSessions = useChatStore((state) => state.clearChatSessions);
  // const removeSession = useChatStore((state) => state.removeSession);

  const { sessions, createSession, clearChatSessions, removeSession } =
    useChatContext();

  const { sortSessions } = useChatSession();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleFilter();
      }
    };
    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [toggleFilter]);

  return (
    <CommandDialog open={isFilterOpen} onOpenChange={filterClose}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            className="gap-3"
            value="new"
            onSelect={(value) => {
              createSession().then((session: TChatSession) => {
                router.push(`/bezs/ai-hub/ask-ai/${session.id}`);
                filterClose();
              });
            }}
          >
            <PlusIcon size={14} weight="bold" />
            New Chat
          </CommandItem>
        </CommandGroup>

        <CommandGroup>
          <CommandItem
            className="gap-3"
            value="clear history"
            onSelect={async (value) => {
              await clearChatSessions!();
              const newSession = await createSession();

              if (newSession[0]?.id) {
                router.push(`/bezs/ai-hub/ask-ai/${newSession.id}`);
                filterClose();
              }
            }}
          >
            <EraserIcon size={14} weight="bold" />
            Clear History
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Chat History">
          {sortSessions(sessions, "updatedAt").map((session) => (
            <CommandItem
              key={session.id}
              value={`${session.id}/${session.title}`}
              className="w-full"
              onSelect={(value) => {
                router.push(`/bezs/ai-hub/ask-ai/${session.id}`);
                filterClose();
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ChatIcon size={14} weight="fill" className="shrink-0" />{" "}
                  <span>{session.title}</span>
                  <span className="pl-4 text-xs dark:text-zinc-400">
                    {moment(session.createdAt).fromNow(true)}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={async () => {
                        await removeSession(session.id);
                        router.push("/bezs/ai-hub/ask-ai");
                      }}
                    >
                      <Trash2 className="text-red-500" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
