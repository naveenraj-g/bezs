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
  SpeakerHighIcon,
  SpinnerIcon,
  StopCircleIcon,
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
import { selectedModel } from "../stores/useSelectedModelStore";
import { useParams } from "next/navigation";
import { goodResponseMessage } from "../serveractions/model-server-actions";
import { useTextToSpeech } from "../hooks/use-text-to-speeck";

export type TAIMessageBubble = {
  chatMessage: TChatMessage;
  isLast: boolean;
};

export const AIMessageBubble = ({ chatMessage, isLast }: TAIMessageBubble) => {
  const params = useParams();
  const sessionId = params?.sessionId;

  const {
    id,
    rawAI,
    isLoading,
    model,
    errorMessage,
    isToolRunning,
    isGoodResponse,
    toolName,
    type,
    context,
    role,
    query,
    image,
  } = chatMessage;

  const { removeMessage, runModel, setIsGoodResponse } = useChatContext();
  const { getToolInfoByKey } = useTools();
  const {
    start,
    stop,
    isSpeaking,
    isLoading: isTextToSpeechLoading,
  } = useTextToSpeech();

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    if (!isGoodResponse) {
                      setIsGoodResponse!({
                        messageId: id,
                        sessionId: sessionId!.toString(),
                      });
                      await goodResponseMessage({ messageId: id });
                    }
                  }}
                >
                  <ThumbsUpIcon
                    size={16}
                    weight={`${isGoodResponse ? "fill" : "bold"}`}
                    color="white"
                  />
                </Button>
              </ActionTooltipProvider>
              <ActionTooltipProvider
                label="Read aloud"
                align="center"
                side="bottom"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isTextToSpeechLoading}
                  onClick={() => {
                    if (isSpeaking) {
                      stop();
                    } else {
                      if (rawAI) {
                        start(rawAI);
                      }
                    }
                  }}
                >
                  {isTextToSpeechLoading ? (
                    <SpinnerIcon
                      className="animate-spin"
                      size={16}
                      weight="bold"
                    />
                  ) : isSpeaking ? (
                    <StopCircleIcon size={16} weight="bold" />
                  ) : (
                    <SpeakerHighIcon size={16} weight="bold" />
                  )}
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
                  onRegenerate={(model: selectedModel) => {
                    runModel({
                      messageId: chatMessage.id,
                      selectedModel: model,
                      role,
                      type,
                      context,
                      image,
                      query,
                      sessionId: chatMessage.sessionId,
                      selectedAssistant:
                        selectedAssistantRef.current || undefined,
                    });
                  }}
                />
              )}
              <Popover>
                <ActionTooltipProvider
                  label="Delete"
                  align="center"
                  side="bottom"
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <TrashSimpleIcon size={16} weight="bold" />
                    </Button>
                  </PopoverTrigger>
                </ActionTooltipProvider>
                <PopoverContent side="bottom" collisionPadding={10}>
                  <p className="text-sm font-medium pb-2">
                    Are you sure, you want to delete this message?
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="h-7 px-2 bg-red-600 hover:bg-red-700 text-white"
                      onClick={async () => {
                        await removeMessage(id);
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
