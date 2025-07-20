"use client";

import { useEffect, useRef, useState } from "react";
import { PromptInput } from "./prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowDown, Copy, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { useParams } from "next/navigation";
// import { useChatStore } from "../stores/useChatStore";
import { TChatSession } from "../types/chat-types";
import { useChatSession } from "../hooks/use-chat-session";

type ChatType = {
  input: string;
  aiOutput: string;
};

const dummyText =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut saepe magni autem, totam repellat atque ducimus sed dolor laborum nostrum. Perferendis explicabo consectetur, porro qui quia atque voluptates quam tempora.";

export const AiChat = () => {
  // const params = useParams();
  // const sessionId = params?.sessionId;
  // const lastStream = useChatStore(state => state.lastStream);
  // const [currentSession, setCurrentSession] = useState<TChatSession | undefined>(undefined);
  // const {getSessionById} = useChatSession();

  const endRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<ChatType[]>([]);
  const [response, setResponse] = useState();
  const [isAtBottom, setIsAtBottom] = useState(true);

  // const fetchSession = async () => {
  //   if (!sessionId) return;

  //   const session = await getSessionById(sessionId?.toString())
  //   setCurrentSession(session);
  // }

  // useEffect(() => {
  //   if (sessionId) {
  //     fetchSession();
  //   }
  // }, [sessionId]);

  // useEffect(() => {
  //   if (!lastStream) {
  //     fetchSession();
  //   }
  // }, [lastStream]);

  // const isLastStreamBelongsToCurrentSession = lastStream?.sessionId === sessionId;

  const handleChat = (prompt: string) => {
    setChat((prevState) => [
      ...prevState,
      { input: prompt, aiOutput: dummyText },
    ]);
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="flex flex-col relative">
      <div
        className="flex-1 overflow-y-auto pb-20 space-y-12 px-2"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {chat.map((item, idx) => (
          <div key={idx} className="space-y-6">
            <div className="bg-zinc-300/30 dark:bg-zinc-700/80 dark:text-white px-3.5 py-2.5  rounded-xl max-w-[65%] w-fit self-end ml-auto">
              {item.input}
            </div>
            <div className="space-y-1">
              <p>{item.aiOutput}</p>
              <div className="flex items-center">
                <ActionTooltipProvider
                  label="copy"
                  align="center"
                  side="bottom"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-transparent dark:hover:!bg-zinc-600/50"
                  >
                    <Copy className="!w-4 !h-4" />
                  </Button>
                </ActionTooltipProvider>
                <ActionTooltipProvider
                  label="Good response"
                  align="center"
                  side="bottom"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-transparent dark:hover:!bg-zinc-600/50"
                  >
                    <ThumbsUp className="!w-4 !h-4" />
                  </Button>
                </ActionTooltipProvider>
                <ActionTooltipProvider
                  label="Bad response"
                  align="center"
                  side="bottom"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-transparent dark:hover:!bg-zinc-600/50"
                  >
                    <ThumbsDown className="!w-4 !h-4" />
                  </Button>
                </ActionTooltipProvider>
                <ActionTooltipProvider
                  label="Delete"
                  align="center"
                  side="bottom"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-transparent dark:hover:!bg-zinc-600/50"
                  >
                    <Trash className="!w-4 !h-4" />
                  </Button>
                </ActionTooltipProvider>
              </div>
            </div>
          </div>
        ))}
        {response && (
          <div className="mt-4 p-3 border rounded bg-gray-100 dark:bg-zinc-800 whitespace-pre-wrap">
            {response}
          </div>
        )}
        <div ref={endRef} />
        {!isAtBottom && (
          <Button
            size="icon"
            variant="ghost"
            onClick={scrollToBottom}
            className="absolute bottom-30 left-1/2 -translate-x-1/2 z-10 rounded-full shadow-lg border border-zinc-600/80 bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-800"
          >
            <ArrowDown className="!w-5 !h-5" />
          </Button>
        )}
      </div>
      <PromptInput
        modelName="GPT 4o"
        handleChat={handleChat}
        setResponse={setResponse}
      />
    </div>
  );
};
