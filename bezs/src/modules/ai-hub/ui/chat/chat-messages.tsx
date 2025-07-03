"use client";

import { useParams } from "next/navigation";
import { useChatStore } from "../../stores/useChatStore";
import { useEffect, useRef, useState } from "react";
import { TChatSession } from "../../types/chat-types";
import { useChatSession } from "../../hooks/use-chat-session";
import { useMarkdown } from "../../hooks/use-mdx";
import Avatar from "boring-avatars";
import { cn } from "@/lib/utils";

export const ChatMessages = () => {
  const params = useParams();
  const sessionId = params?.sessionId;
  const lastStream = useChatStore((state) => state.lastStream);
  const currentSession = useChatStore((state) => state.currentSession);
  const error = useChatStore((state) => state.error);
  const { renderMarkdown } = useMarkdown();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isNewSession = currentSession?.messages?.length === 0;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  useEffect(() => {
    if (lastStream) {
      scrollToBottom();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === currentSession?.id;

  const renderMessage = (
    key: string,
    humanMessage: string,
    aiMessage: string
  ) => {
    return (
      <div className="flex flex-col gap-2 items-start w-full" key={key}>
        <div className="dark:bg-white/5 rounded-2xl p-2 text-sm flex flex-row items-center gap-2 pr-4 border border-white/10">
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
          <Avatar name="Chat" className="w-8 h-8" />
          <span>{humanMessage}</span>
        </div>
        <div className="rounded-2xl p-4 w-full border border-white/10">
          {renderMarkdown(aiMessage)}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={chatContainerRef}
      className={cn("flex-1 overflow-y-auto pb-28", isNewSession && "flex-0")}
    >
      <div className="flex flex-col gap-8">
        {currentSession?.messages.map((message) =>
          renderMessage(message.id, message.rawHuman, message.rawAI)
        )}
      </div>

      {isLastStreamBelongsToCurrentSession &&
        lastStream?.props?.query &&
        renderMessage("last", lastStream?.props.query, lastStream.message)}
      {error && (
        <div className="text-red-500">
          {renderMessage("error", "Ahh!", error)}
        </div>
      )}
    </div>
  );
};
