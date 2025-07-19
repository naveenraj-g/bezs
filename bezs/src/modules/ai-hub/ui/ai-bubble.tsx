"use client";

import { useRef } from "react";
import { TRenderMessageProps } from "./chat/chat-messages";
import { useClipboard } from "../hooks/use-clipboard";
import { useMarkdown } from "../hooks/use-mdx";
import { motion, easeInOut } from "framer-motion";
import Spinner from "./loading-spinner";
import { LinearSpinner } from "./loading-spinner";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import { Button } from "@/components/ui/button";
import {
  ArrowClockwiseIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  CopyIcon,
  InfoIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useChatStore } from "../stores/useChatStore";
import { toast } from "sonner";
import { TChatMessage } from "../types/chat-types";
import { encodingForModel } from "js-tiktoken";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { id, humanMessage, aiMessage, loading, model } = props;
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  const removeMessage = useChatStore((state) => state.removeMessage);

  const messageRef = useRef<HTMLDivElement>(null);

  const { showCopied, copy } = useClipboard();
  const { renderMarkdown } = useMarkdown();

  const handleCopyContent = () => {
    if (messageRef?.current && aiMessage) {
      copy(aiMessage);
    }
  };

  const getTokenCount = (
    message: Partial<Pick<TChatMessage, "model" | "rawAI">>
  ) => {
    const enc = encodingForModel("gpt-3.5-turbo");

    if (message.rawAI) {
      return enc.encode(message.rawAI).length;
    }

    return undefined;
  };

  const tokenCount = getTokenCount({ model, rawAI: aiMessage });

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: easeInOut },
      }}
      className="rounded-2xl p-3 w-full border border-black/10 dark:border-white/10 flex flex-col items-start"
    >
      {aiMessage && (
        <div className="w-full">
          {renderMarkdown(aiMessage, id === "streaming")}
        </div>
      )}
      <div className="flex flex-row w-full justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
        <motion.div
          className="text-xs py-1/2 px-2 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: easeInOut },
          }}
        >
          <span>
            {loading ? <LinearSpinner /> : selectedModel?.displayName}
          </span>
          {tokenCount && (
            <ActionTooltipProvider
              label="Estimated Output Tokens"
              align="center"
              side="bottom"
            >
              <span className="flex gap-1 items-center cursor-pointer">
                {getTokenCount({
                  model,
                  rawAI: aiMessage,
                })}{" "}
                tokens
                <InfoIcon size={14} weight="bold" className="inline-block" />
              </span>
            </ActionTooltipProvider>
          )}
        </motion.div>
        {!loading && (
          <div className="flex flex-row gap-1">
            <ActionTooltipProvider label="Copy" align="center" side="bottom">
              <Button variant="ghost" size="icon" onClick={handleCopyContent}>
                {showCopied ? (
                  <CheckIcon size={16} weight="regular" />
                ) : (
                  <CopyIcon size={16} weight="regular" />
                )}
              </Button>
            </ActionTooltipProvider>
            <ActionTooltipProvider
              label="Regenerate"
              align="center"
              side="bottom"
            >
              <Button variant="ghost" size="icon">
                <ArrowClockwiseIcon size={16} weight="regular" />
              </Button>
            </ActionTooltipProvider>
            <ActionTooltipProvider label="Delete" align="center" side="bottom">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  removeMessage(id);
                  toast("Message Deleted.", {
                    duration: 600,
                  });
                }}
              >
                <TrashSimpleIcon size={16} weight="regular" />
              </Button>
            </ActionTooltipProvider>
          </div>
        )}
      </div>
    </motion.div>
  );
};
