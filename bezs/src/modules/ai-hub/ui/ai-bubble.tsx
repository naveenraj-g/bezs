"use client";

import { useEffect, useRef } from "react";
import { useClipboard } from "../hooks/use-clipboard";
import { useMarkdown } from "../hooks/use-mdx";
import { motion, easeInOut } from "framer-motion";
import { LinearSpinner } from "./loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CheckIcon,
  CopyIcon,
  InfoIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { TChatMessage } from "../types/chat-types";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { useChatContext } from "../context/chat/context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RegenerateWithModelSelect } from "./regenerate-model-select";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTokenCounter } from "../hooks/use-token-counter";
import { TToolKey, useTools } from "../hooks/use-tools";
import { assistantStore } from "../stores/assistantStore";
import { Assistant } from "../../../../prisma/generated/ai-hub";

export type TAIMessageBubble = {
  chatMessage: TChatMessage;
  isLast: boolean;
};

export const AIMessageBubble = ({ chatMessage, isLast }: TAIMessageBubble) => {
  const { id, rawAI, isLoading, model, errorMessage, isToolRunning, toolName } =
    chatMessage;
  const { removeMessage, runModel } = useChatContext();
  const { getToolInfoByKey } = useTools();

  const toolUsed = toolName
    ? getToolInfoByKey(toolName as TToolKey)
    : undefined;

  const messageRef = useRef<HTMLDivElement>(null);

  const selectedAssistantRef = useRef<Assistant | null>(
    assistantStore.getState().selectedAssistant
  );

  useEffect(() => {
    const unsub = assistantStore.subscribe((state) => {
      selectedAssistantRef.current = state.selectedAssistant;
    });

    return unsub;
  }, []);

  const { showCopied, copy } = useClipboard();
  const { renderMarkdown } = useMarkdown();
  const { getTokenCount } = useTokenCounter();

  const handleCopyContent = () => {
    if (messageRef?.current && rawAI) {
      copy(rawAI);
    }
  };

  const tokenCount = getTokenCount(rawAI!);

  return (
    <div className="flex flex-row gap-2 w-full">
      <motion.div
        ref={messageRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 1, ease: easeInOut },
        }}
        className="rounded-2xl p-3 w-full flex flex-col items-start"
      >
        {toolUsed && (
          <div className="flex flex-row gap-2 py-2 items-center text-xs text-zinc-500/70 dark:text-zinc-400">
            {toolUsed.smallIcon()}
            {isToolRunning ? (
              <p className="text-xs">{toolUsed.loadingMessage}</p>
            ) : (
              <p>{toolUsed.resultMessage}</p>
            )}
          </div>
        )}
        {rawAI && (
          <div className="pb-2 w-full">
            {renderMarkdown(rawAI, !!isLoading)}
          </div>
        )}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="flex xs:flex-row flex-col w-full justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
          <motion.div
            className="text-xs py-1/2 px-2 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 1, ease: easeInOut },
            }}
          >
            <span>
              {isLoading && !isToolRunning ? <LinearSpinner /> : model}
            </span>
            {tokenCount && !isLoading && (
              <ActionTooltipProvider
                label="Estimated Output Tokens"
                align="center"
                side="bottom"
              >
                <span className="flex gap-1 items-center cursor-pointer">
                  {tokenCount} tokens
                  <InfoIcon size={14} weight="bold" className="inline-block" />
                </span>
              </ActionTooltipProvider>
            )}
          </motion.div>
          {!isLoading && (
            <div className="flex flex-row gap-1">
              <ActionTooltipProvider
                label="Good response"
                align="center"
                side="bottom"
              >
                <Button variant="ghost" size="icon">
                  <ThumbsUpIcon size={16} weight="bold" />
                </Button>
              </ActionTooltipProvider>
              <ActionTooltipProvider
                label="Bad response"
                align="center"
                side="bottom"
              >
                <Button variant="ghost" size="icon">
                  <ThumbsDownIcon size={16} weight="bold" />
                </Button>
              </ActionTooltipProvider>
              <ActionTooltipProvider label="Copy" align="center" side="bottom">
                <Button variant="ghost" size="icon" onClick={handleCopyContent}>
                  {showCopied ? (
                    <CheckIcon size={16} weight="bold" />
                  ) : (
                    <CopyIcon size={16} weight="bold" />
                  )}
                </Button>
              </ActionTooltipProvider>
              {chatMessage && isLast && (
                <RegenerateWithModelSelect
                  onRegenerate={(model: string | undefined) => {
                    runModel({
                      messageId: chatMessage.id,
                      selectedModel: model || undefined,
                      props: chatMessage.props!,
                      sessionId: chatMessage.sessionId,
                      selectedAssistant:
                        selectedAssistantRef.current || undefined,
                    });
                  }}
                />
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <ActionTooltipProvider
                    label="Delete"
                    align="center"
                    side="bottom"
                  >
                    <Button variant="ghost" size="icon">
                      <TrashSimpleIcon size={16} weight="bold" />
                    </Button>
                  </ActionTooltipProvider>
                </PopoverTrigger>
                <PopoverContent side="bottom" collisionPadding={10}>
                  <p className="text-sm font-medium pb-2">
                    Are you sure, you want to delete this message?
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="h-7 px-2 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        removeMessage(id);
                      }}
                    >
                      Delete Message
                    </Button>
                    <PopoverClose
                      className={cn(
                        "!h-7 !px-2",
                        buttonVariants({ variant: "ghost", size: "sm" })
                      )}
                    >
                      Cancel
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
