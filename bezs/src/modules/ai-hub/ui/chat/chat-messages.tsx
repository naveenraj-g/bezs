"use client";

import { useParams } from "next/navigation";
import { useChatStore } from "../../stores/useChatStore";
import { useEffect, useState } from "react";
import { TChatSession } from "../../types/chat-types";
import { useChatSession } from "../../hooks/use-chat-session";

export const ChatMessages = () => {
  const params = useParams();
  const sessionId = params?.sessionId;
  const lastStream = useChatStore((state) => state.lastStream);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >(undefined);
  const { getSessionById } = useChatSession();

  const fetchSession = async () => {
    if (!sessionId) return;

    const session = await getSessionById(sessionId?.toString());
    setCurrentSession(session);
  };

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (!lastStream) {
      fetchSession();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === sessionId;

  return (
    <div>
      {currentSession?.messages.map((message) => (
        <div className="p-2" key={message.id}>
          {message.rawHuman}
          {message.rawAI}
        </div>
      ))}
      {isLastStreamBelongsToCurrentSession && (
        <div className="p-2">
          {lastStream?.props?.query}
          {lastStream?.message}
        </div>
      )}
    </div>
  );
};
