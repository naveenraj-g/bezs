"use client";

import { useParams } from "next/navigation";
import { useChatStore } from "../../stores/useChatStore";
import { useEffect, useRef, useState } from "react";
import { TChatMessage, TChatSession } from "../../types/chat-types";
import { useChatSession } from "../../hooks/use-chat-session";
import { useMarkdown } from "../../hooks/use-mdx";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WarningIcon } from "@phosphor-icons/react";
import { TModelKey } from "../../hooks/use-model-list";
import { easeInOut, motion } from "framer-motion";
import Spinner, { LinearSpinner } from "../loading-spinner";
import { ProfileAvatar } from "@/modules/telemedicine/ui/profile-image";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import moment from "moment";
import { getRelativeDate } from "@/utils/helper";

export type TRenderMessageProps = {
  key: string;
  humanMessage: string;
  model: TModelKey;
  aiMessage?: string;
  loading?: boolean;
};

export type TMessageListByDate = Record<string, TChatMessage[]>;

export const ChatMessages = () => {
  const params = useParams();
  const session = useSession();
  const sessionId = params?.sessionId;
  const streamingMessage = useChatStore((state) => state.streamingMessage);
  const currentSession = useChatStore((state) => state.currentSession);
  const { renderMarkdown } = useMarkdown();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isNewSession = currentSession?.messages?.length === 0;

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (streamingMessage) {
      scrollToBottom();
    }
  }, [streamingMessage]);

  const isLastStreamBelongsToCurrentSession =
    streamingMessage?.sessionId === currentSession?.id;

  const renderMessage = (props: TRenderMessageProps) => {
    const { key, humanMessage, aiMessage, loading, model } = props;

    return (
      <div className="flex flex-col gap-2 items-start w-full" key={key}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, ease: easeInOut } }}
          className="dark:bg-white/5 rounded-2xl p-1.5 text-sm flex flex-row items-center gap-2 pr-4 border border-black/10 dark:border-white/10"
        >
          {/* <div className="w-8 h-8 rounded-full relative">
            <Avatar
              size={32}
              name={humanMessage}
              variant="marble"
              color={"#FFFFFF"}
            />
            <p className="absolute font-bold inset-0 flex items-center justify-center">
              D
            </p>
          </div> */}
          <ProfileAvatar
            name={session.data?.user.name}
            imgUrl={session.data?.user.image}
          />
          <span>{humanMessage}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: easeInOut },
          }}
          className="rounded-2xl p-3 w-full border border-black/10 dark:border-white/10"
        >
          {aiMessage && renderMarkdown(aiMessage, key === "streaming")}
          {loading && <LinearSpinner />}
        </motion.div>
        <motion.p
          className={`text-xs py-1/2 px-2 ${loading && "pt-2"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, ease: easeInOut } }}
        >
          {model}
        </motion.p>
      </div>
    );
  };

  const messagesByDate = currentSession?.messages.reduce(
    (acc: TMessageListByDate, message) => {
      const date = moment(message.createdAt)?.format("YYYY-MM-DD");

      if (!acc?.[date]) {
        acc[date] = [message];
      } else {
        acc[date] = [...acc[date], message];
      }
      return acc;
    },
    {}
  );

  return (
    <div
      ref={chatContainerRef}
      className={cn("flex-1 overflow-y-auto pb-28", isNewSession && "hidden")}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: easeInOut } }}
        className="flex flex-col gap-8"
      >
        {messagesByDate &&
          Object.keys(messagesByDate).map((date, i) => {
            return (
              <div key={i} className="flex flex-col">
                <div className="flex flex-row items-center pb-4 pt-8">
                  <div className="w-full h-[1px] bg-black/5 dark:bg-white/10"></div>
                  <p className="text-xs text-zinc-400 px-2 flex shrink-0">
                    {getRelativeDate(date)}
                  </p>
                  <div className="w-full h-[1px] bg-black/5 dark:bg-white/10"></div>
                </div>
                <div className="flex flex-col gap-10 w-full items-start">
                  {messagesByDate[date].map((message) =>
                    renderMessage({
                      key: message.id,
                      humanMessage: message.rawHuman,
                      model: message.model,
                      aiMessage: message.rawAI,
                    })
                  )}
                </div>
              </div>
            );
          })}

        {isLastStreamBelongsToCurrentSession &&
          streamingMessage?.props?.query &&
          !streamingMessage?.error &&
          renderMessage({
            key: "streaming",
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            model: streamingMessage?.model,
            loading: streamingMessage?.loading,
          })}
        {streamingMessage?.error && (
          <Alert variant="destructive" className="mt-4">
            <WarningIcon size={20} weight="bold" />
            <AlertTitle>Ahh! something went wrong!</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
};

// 6:35
