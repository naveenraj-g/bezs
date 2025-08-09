"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { AlertCircleIcon, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { assistantStore } from "../stores/assistantStore";
import { Assistant } from "../../../../prisma/generated/ai-hub";
import { getAssistantsData } from "../serveractions/assistant-server-action";
import { XIcon } from "@phosphor-icons/react";

export const AssistantSelect = () => {
  const setSelectedAssistant = assistantStore(
    (state) => state.setSelectedAssistant
  );
  const selectedAssistant = assistantStore((state) => state.selectedAssistant);
  const [allAssistants, setAllAssistants] = useState<Assistant[]>([]);

  const { execute, isPending, isError } = useServerAction(getAssistantsData);

  useEffect(() => {
    (async () => {
      const [data] = await execute();

      if (data) {
        setAllAssistants(data || []);
      }
    })();
  }, [execute]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 py-1 text-xs border border-zinc-400",
            isError && "text-red-500 hover:text-red-500",
            !selectedAssistant && "text-yellow-500 hover:text-yellow-500"
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Loading
            </>
          ) : isError ? (
            <>
              <AlertCircleIcon /> Error Occurred
            </>
          ) : !selectedAssistant ? (
            "Select Assistant"
          ) : (
            selectedAssistant?.name
          )}
        </Button>
      </DropdownMenuTrigger>
      {!isPending && !isError && (
        <DropdownMenuContent className="max-h-56 overflow-y-auto">
          <DropdownMenuLabel className="text-sm">Assistants</DropdownMenuLabel>
          {allAssistants.length === 0 && (
            <DropdownMenuItem className="text-red-400 hover:text-red-400">
              No Assistant Found
            </DropdownMenuItem>
          )}
          <DropdownMenuGroup>
            {allAssistants.map((assistant) => (
              <DropdownMenuItem
                key={assistant.id}
                onClick={() => {
                  setSelectedAssistant(assistant);
                }}
              >
                {assistant.name}
                {selectedAssistant?.name === assistant.name && <Check />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {selectedAssistant && (
            <DropdownMenuItem onClick={() => setSelectedAssistant(null)}>
              <XIcon size={8} weight="bold" className="text-red-500" />
              Remove Assistant
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
