"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { getModelsName } from "../serveractions/model-server-actions";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import { AlertCircleIcon, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TModel = {
  id: string | null;
  displayName: string | null;
  modelName: string | null;
  tokens: string | null;
  defaultPrompt?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxToken?: number;
};

export const ModelSelect = () => {
  const setSelectedModel = useSelectedModelStore(
    (state) => state.setSelectedModel
  );
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  const [allModels, setAllModels] = useState<TModel[]>([]);

  const { execute, isPending, isError } = useServerAction(getModelsName);

  useEffect(() => {
    (async () => {
      const [data] = await execute();

      if (data) {
        const modelData = data.map((d) => {
          return {
            id: d?.id,
            displayName: d.displayName,
            modelName: d.modelName,
            tokens: d.tokens,
            ...d.modelSettings,
          };
        });
        setAllModels(modelData ?? []);
        setSelectedModel(modelData[0]);
      }
    })();
  }, [execute, setSelectedModel]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 py-1 text-xs border border-zinc-400",
            isError && "text-red-500 hover:text-red-500",
            !selectedModel && "text-yellow-500 hover:text-yellow-500"
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
          ) : !selectedModel ? (
            "No Model"
          ) : (
            selectedModel?.displayName
          )}
        </Button>
      </DropdownMenuTrigger>
      {!isPending && !isError && (
        <DropdownMenuContent className="max-h-56 overflow-y-auto">
          <DropdownMenuLabel className="text-sm">Models</DropdownMenuLabel>
          {allModels.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => {
                setSelectedModel(model);
              }}
              className="text-xs text-zinc-700 dark:text-zinc-300"
            >
              {model.displayName}
              {selectedModel?.displayName === model.displayName && <Check />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
