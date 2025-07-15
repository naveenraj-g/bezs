"use client";

import { useRef } from "react";
import { TRenderMessageProps } from "./chat/chat-messages";
import { useClipboard } from "../hooks/use-clipboard";
import { useMarkdown } from "../hooks/use-mdx";
import { motion, easeInOut } from "framer-motion";
import Spinner from "./loading-spinner";
import { useSelectedModelStore } from "../stores/useSelectedModelStore";
import { Button } from "@/components/ui/button";
import {
  ArrowClockwiseIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  CopyIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { key, humanMessage, aiMessage, loading, model } = props;
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);

  const messageRef = useRef<HTMLDivElement>(null);

  const { showCopied, copy } = useClipboard();
  const { renderMarkdown } = useMarkdown();

  const handleCopyContent = () => {
    if (messageRef?.current && aiMessage) {
      copy(aiMessage);
    }
  };

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
      {aiMessage && renderMarkdown(aiMessage, key === "streaming")}
      {loading && <Spinner />}
      <div className="flex flex-row w-full justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
        <motion.p
          className="text-xs py-1/2 px-2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: easeInOut },
          }}
        >
          {selectedModel?.displayName}
        </motion.p>
        <div className="flex flex-row gap-1">
          <Button variant="ghost" size="icon">
            <BookmarkSimpleIcon size={16} weight="regular" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopyContent}>
            {showCopied ? (
              <CheckIcon size={16} weight="regular" />
            ) : (
              <CopyIcon size={16} weight="regular" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowClockwiseIcon size={16} weight="regular" />
          </Button>
          <Button variant="ghost" size="icon">
            <TrashSimpleIcon size={16} weight="regular" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
