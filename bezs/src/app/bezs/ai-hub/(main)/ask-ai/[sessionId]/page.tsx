"use client";

import { useChatContext } from "@/modules/ai-hub/context/chat/context";
import { ChatInput } from "@/modules/ai-hub/ui/chat/chat-input";
import { ChatMessages } from "@/modules/ai-hub/ui/chat/chat-messages";
import Spinner from "@/modules/ai-hub/ui/loading-spinner";

const ChatSessionPage = () => {
  const { isCurrentSessionLoading, isAllSessionLoading } = useChatContext();

  const renderLoader = () => {
    return (
      <div className="w-full h-full flex gap-1 justify-center items-center">
        <Spinner /> Loading...
      </div>
    );
  };

  const isLoading = isCurrentSessionLoading || isAllSessionLoading;

  return (
    <div className="flex-1 flex flex-col h-full relative justify-center">
      {isLoading && renderLoader()}
      {!isLoading && (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatSessionPage;
