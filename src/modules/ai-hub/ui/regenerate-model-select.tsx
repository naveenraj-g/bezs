import { useEffect, useRef } from "react";
import {
  selectedModel,
  useSelectedModelStore,
} from "../stores/useSelectedModelStore";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { Button } from "@/components/ui/button";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";

export type TRegenerateModelSelect = {
  onRegenerate: (model: selectedModel) => void;
};

export const RegenerateWithModelSelect = ({
  onRegenerate,
}: TRegenerateModelSelect) => {
  const selectedModelRef = useRef<selectedModel | null>(
    useSelectedModelStore.getState().selectedModel
  );

  useEffect(() => {
    const unsub = useSelectedModelStore.subscribe((state) => {
      selectedModelRef.current = state.selectedModel;
    });

    return unsub;
  }, []);

  return (
    <>
      <ActionTooltipProvider label="Regenerate" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (
              selectedModelRef.current &&
              selectedModelRef.current.modelName
            ) {
              onRegenerate(selectedModelRef.current || undefined);
            }
          }}
          disabled={
            !selectedModelRef.current || !selectedModelRef.current.modelName
          }
        >
          <ArrowClockwiseIcon size={16} weight="bold" />
        </Button>
      </ActionTooltipProvider>
    </>
  );
};
