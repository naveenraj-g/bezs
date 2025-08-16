import { useEffect, useState } from "react";
import { TToolKey, useTools } from "../hooks/use-tools";
import { usePreferences } from "../hooks/use-preferences";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { Button } from "@/components/ui/button";
import { PuzzlePieceIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";

export type TPluginSelect = {
  selectedModel: string;
};

export const PluginSelect = () => {
  const { tools } = useTools();
  const { setPreferences, getPreferences } = usePreferences();
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  const defaultModelPreferences = useSelectedModelStore(
    (state) => state.defaultModelPreferences
  );

  const plugins = selectedModel?.plugins || defaultModelPreferences.plugins;

  const [selectedPlugins, setSelectedPlugins] = useState<TToolKey[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedPlugins(preferences.defaultPlugins || []);
    });
  }, [isOpen]);

  if (plugins.length == 0) {
    return null;
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <ActionTooltipProvider label="Plugins">
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <PuzzlePieceIcon size={16} weight="bold" />
            </Button>
          </PopoverTrigger>
        </ActionTooltipProvider>
        <PopoverContent
          side="top"
          className="p-1 w-[250px] dark:bg-zinc-700 rounded-2xl"
        >
          {tools.map((tool) => (
            <div
              key={tool.key}
              className="flex text-xs md:text-sm gap-2 w-fukk p-2 hover:bg-zinc-50 dark:hover:bg-black/30 rounded-2xl"
            >
              {tool.icon("md")} {tool.name} <span className="flex-1" />
              <Switch
                checked={selectedPlugins.includes(tool.key)}
                onCheckedChange={(checked) => {
                  getPreferences().then((preferences) => {
                    const defaultPlugins = preferences.defaultPlugins || [];
                    if (checked) {
                      setPreferences({
                        defaultPlugins: [...defaultPlugins, tool.key],
                      });
                      setSelectedPlugins([...selectedPlugins, tool.key]);
                    } else {
                      setPreferences({
                        defaultPlugins: defaultPlugins.filter(
                          (plugin) => plugin !== tool.key
                        ),
                      });
                      setSelectedPlugins(
                        selectedPlugins.filter((plugin) => plugin !== tool.key)
                      );
                    }
                  });
                }}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
};
