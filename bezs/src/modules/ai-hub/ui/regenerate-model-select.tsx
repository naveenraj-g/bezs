import { useState } from "react";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { Button } from "@/components/ui/button";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";

export type TRegenerateModelSelect = {
  onRegenerate: (modelKey: string) => void;
};

export const RegenerateWithModelSelect = ({
  onRegenerate,
}: TRegenerateModelSelect) => {
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <ActionTooltipProvider label="Regenerate" side="bottom">
          <DropdownMenuTrigger asChild>
            {
              <Button variant="ghost" size="icon">
                <ArrowClockwiseIcon size={16} weight="bold" />
              </Button>
            }
          </DropdownMenuTrigger>
        </ActionTooltipProvider>

        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              if (selectedModel && selectedModel.modelName) {
                onRegenerate(selectedModel.modelName);
              }
            }}
            disabled={!selectedModel || !selectedModel.modelName}
          >
            {selectedModel?.modelName ?? "No model selected"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
