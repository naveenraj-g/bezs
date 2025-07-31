"use client";

import { useParams } from "next/navigation";
// import { useChatStore } from "../../stores/useChatStore";
import { useEffect, useRef } from "react";
import {
  PromptProps,
  TChatMessage,
  TChatSession,
} from "../../types/chat-types";
import { useChatSession } from "../../hooks/use-chat-session";
import { useMarkdown } from "../../hooks/use-mdx";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QuotesIcon, WarningIcon } from "@phosphor-icons/react";
import { TModelKey } from "../../hooks/use-model-list";
import { easeInOut, motion } from "framer-motion";
import Spinner, { LinearSpinner } from "../loading-spinner";
import { ProfileAvatar } from "@/modules/telemedicine/ui/profile-image";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import moment from "moment";
import { getRelativeDate } from "@/utils/helper";
import { AIMessageBubble } from "../ai-bubble";
import Image from "next/image";
import { useChatContext } from "../../context/chat/context";

export type TRenderMessageProps = {
  id: string;
  humanMessage: string;
  props?: PromptProps;
  image?: string;
  model: TModelKey;
  aiMessage?: string;
  loading?: boolean;
};

export type TMessageListByDate = Record<string, TChatMessage[]>;

export const ChatMessages = () => {
  const params = useParams();
  const session = useSession();
  const sessionId = params?.sessionId;
  // const streamingMessage = useChatStore((state) => state.streamingMessage);
  // const currentSession = useChatStore((state) => state.currentSession);
  const { renderMarkdown } = useMarkdown();

  const { currentSession } = useChatContext();

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

  // useEffect(() => {
  //   if (streamingMessage) {
  //     scrollToBottom();
  //   }
  // }, [streamingMessage]);

  // const isLastStreamBelongsToCurrentSession =
  //   streamingMessage?.sessionId === currentSession?.id;

  const renderMessage = (message: TChatMessage, isLast: boolean) => {
    return (
      <div className="flex flex-col gap-2 items-start w-full" key={message.id}>
        {message.props?.context && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 1,
                ease: easeInOut,
              },
            }}
            className="rounded-2xl p-2 pl-3 text-sm flex flex-row gap-2 pr-4 border border-white/5"
          >
            <QuotesIcon size={16} weight="fill" className="shrink-0 mt-2" />
            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {message.props?.context}
            </span>
          </motion.div>
        )}
        {message?.props?.image && (
          <Image
            src={message?.props?.image}
            alt="uploaded image"
            width={0}
            height={0}
            className="rounded-2xl min-w-[120px] h-[120px] border border-white/5 shadow-md object-cover"
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, ease: easeInOut } }}
          className="dark:bg-white/10 bg-black/5 rounded-2xl p-1.5 text-sm flex flex-row items-center gap-2 pr-4 border border-black/10 dark:border-white/10 self-end max-w-[60%] max-h-[300px] overflow-y-auto"
        >
          <ProfileAvatar
            name={session.data?.user.name}
            imgUrl={session.data?.user.image}
          />
          <span>{message.rawHuman}</span>
        </motion.div>
        <AIMessageBubble chatMessage={message} isLast={isLast} />
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
      id="chat-container"
      className={cn(
        "flex-1 overflow-y-auto pb-28 pr-2",
        isNewSession && "hidden"
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: easeInOut } }}
        className="flex flex-col gap-8"
      >
        {/* {messagesByDate &&
          Object.keys(messagesByDate).map((date) => {
            return (
              <div key={date} className="flex flex-col">
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
                      id: message.id,
                      humanMessage: message.rawHuman,
                      model: message.model,
                      image: message?.image,
                      props: message.props,
                      aiMessage: message.rawAI,
                    })
                  )}
                </div>
              </div>
            );
          })} */}

        <div className="flex flex-col gap-10 w-full items-start">
          {currentSession?.messages?.map((message, index) =>
            renderMessage(
              message,
              currentSession?.messages?.length - 1 === index
            )
          )}
        </div>

        {/* {isLastStreamBelongsToCurrentSession &&
          streamingMessage?.props?.query &&
          !streamingMessage?.error &&
          renderMessage({
            id: "streaming",
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            image: streamingMessage?.props?.image,
            model: streamingMessage?.model,
            loading: streamingMessage?.loading,
          })}
        {streamingMessage?.error && (
          <Alert variant="destructive" className="mt-4">
            <WarningIcon size={20} weight="bold" />
            <AlertTitle>Ahh! something went wrong!</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )} */}
      </motion.div>
    </div>
  );
};

// 8:44
