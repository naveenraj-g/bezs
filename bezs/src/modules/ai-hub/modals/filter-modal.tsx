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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatIcon, EraserIcon, PlusIcon } from "@phosphor-icons/react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const FilterModal = () => {
  const router = useRouter();

  const isFilterOpen = useFilterStore((state) => state.isFilterOpen);
  const toggleFilter = useFilterStore((state) => state.toggleFilter);
  const filterClose = useFilterStore((state) => state.dismiss);

  const {
    sessions,
    createSession,
    clearChatSessions,
    removeSession,
    currentSession,
  } = useChatContext();

  const { sortSessions } = useChatSession();

  const allSortedSessions = sortSessions(sessions, "updatedAt");

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

  const actions = [
    {
      name: "New Chat",
      icon: PlusIcon,
      action: async () => {
        const newSession = await createSession();

        if (newSession?.id) {
          router.push(`/bezs/ai-hub/ask-ai/${newSession.id}`);
          filterClose();
        }
      },
    },
    {
      name: "Clear History",
      icon: EraserIcon,
      action: async () => {
        filterClose();
        toast.warning("Are you sure?", {
          description:
            "This will clear all chat history. This action can't be undone.",
          action: {
            label: "Delete",
            onClick: async () => {
              await clearChatSessions();
              router.push(`/bezs/ai-hub/ask-ai`);
            },
          },
          actionButtonStyle: {
            padding: "0.8rem",
          },
          closeButton: true,
        });
      },
    },
  ];

  return (
    <CommandDialog open={isFilterOpen} onOpenChange={filterClose}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          {actions.map((action, index) => {
            return (
              <CommandItem
                key={index}
                className="gap-2 rounded-lg h-10"
                onSelect={action.action}
              >
                <action.icon size={14} weight="bold" className="shrink-0" />
                {action.name}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandGroup heading="Chat History">
          {allSortedSessions.length === 0 && (
            <CommandItem>No chat history found</CommandItem>
          )}
          {allSortedSessions.map((session) => (
            <CommandItem
              key={session.id}
              value={`${session.id}/${session.title}`}
              className={cn(
                "w-full h-10 rounded-lg",
                currentSession?.id === session.id
                  ? "bg-black/10 dark:bg-white/10"
                  : undefined
              )}
              onSelect={() => {
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
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
