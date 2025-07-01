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
import { useChatStore } from "../stores/useChatStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TChatSession } from "../types/chat-types";
import { ChatIcon, PlusIcon } from "@phosphor-icons/react";

// 2:32
export const FilterModal = () => {
  const router = useRouter();

  const isFilterOpen = useFilterStore((state) => state.isFilterOpen);
  const toggleFilter = useFilterStore((state) => state.toggleFilter);
  const filterClose = useFilterStore((state) => state.dismiss);
  const sessions = useChatStore((state) => state.sessions);
  const createSession = useChatStore((state) => state.createSession);

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
        <CommandGroup heading="Chat History">
          {sessions.map((session) => (
            <CommandItem
              key={session.id}
              value={`${session.id}/${session.title}`}
              className="w-full"
              onSelect={(value) => {
                router.push(`/bezs/ai-hub/ask-ai/${session.id}`);
                filterClose();
              }}
            >
              <ChatIcon size={14} weight="fill" className="shrink-0" />{" "}
              <span>{session.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
