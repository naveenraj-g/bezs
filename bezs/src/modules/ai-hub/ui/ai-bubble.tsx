"use client";

import { useRef, useState } from "react";
import { TRenderMessageProps } from "./chat/chat-messages";
import { useClipboard } from "../hooks/use-clipboard";
import { useMarkdown } from "../hooks/use-mdx";
import { motion, easeInOut } from "framer-motion";
import Spinner from "./loading-spinner";
import { LinearSpinner } from "./loading-spinner";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowClockwiseIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  CopyIcon,
  InfoIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
// import { useChatStore } from "../stores/useChatStore";
import { toast } from "sonner";
import { TChatMessage } from "../types/chat-types";
import { encodingForModel } from "js-tiktoken";
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

export type TAIMessageBubble = {
  chatMessage: TChatMessage;
  isLast: boolean;
};

export const AIMessageBubble = ({ chatMessage, isLast }: TAIMessageBubble) => {
  const { id, rawAI, isLoading, model, errorMessage } = chatMessage;
  // const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  // const removeMessage = useChatStore((state) => state.removeMessage);
  const { removeMessage, runModel } = useChatContext();

  const messageRef = useRef<HTMLDivElement>(null);

  const { showCopied, copy } = useClipboard();
  const { renderMarkdown } = useMarkdown();
  const { countPricing, getTokenCount } = useTokenCounter();

  const handleCopyContent = () => {
    if (messageRef?.current && rawAI) {
      copy(rawAI);
    }
  };

  // const getTokenCount = (
  //   message: Partial<Pick<TChatMessage, "model" | "rawAI">>
  // ) => {
  //   const enc = encodingForModel("gpt-3.5-turbo");

  //   if (message.rawAI) {
  //     return enc.encode(message.rawAI).length;
  //   }

  //   return undefined;
  // };

  // const tokenCount = getTokenCount({ model, rawAI });
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
        {rawAI && (
          <div className="pb-2 w-full">
            {renderMarkdown(rawAI, id === "streaming")}
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
            <span>{isLoading ? <LinearSpinner /> : model}</span>
            {tokenCount && !isLoading && (
              <ActionTooltipProvider
                label="Estimated Output Tokens"
                align="center"
                side="bottom"
              >
                <span className="flex gap-1 items-center cursor-pointer">
                  {tokenCount}
                  tokens
                  <InfoIcon size={14} weight="bold" className="inline-block" />
                </span>
              </ActionTooltipProvider>
            )}
          </motion.div>
          {!isLoading && (
            <div className="flex flex-row gap-1">
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
                  onRegenerate={(model: string) => {
                    runModel({
                      messageId: chatMessage.id,
                      selectedModel: model,
                      props: chatMessage.props!,
                      sessionId: chatMessage.sessionId,
                    });
                  }}
                />
              )}
              <ActionTooltipProvider
                label="Delete"
                align="center"
                side="bottom"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <TrashSimpleIcon size={16} weight="bold" />
                    </Button>
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
              </ActionTooltipProvider>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
