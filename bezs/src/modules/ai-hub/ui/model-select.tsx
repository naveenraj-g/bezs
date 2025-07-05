import { useEffect, useState } from "react";
import { TModelKey, useModelList } from "../hooks/use-model-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePreferences } from "../hooks/use-preferences";

export const ModelSelect = () => {
  const { models, getModelByKey } = useModelList();
  const { getPreferences, setPreferences } = usePreferences();

  const [selectedModel, setSelectedModel] =
    useState<TModelKey>("llama3-70b-8192");

  const activeModel = getModelByKey(selectedModel);

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedModel(preferences.defaultModel);
    });
  }, [getPreferences]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 text-xs border border-zinc-400"
        >
          {activeModel?.icon()} {activeModel?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-56 overflow-y-auto">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.key}
            onClick={() => {
              setPreferences({ defaultModel: model.key }).then(() => {
                setSelectedModel(model.key);
              });
            }}
          >
            {model.icon()} {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 4:32
