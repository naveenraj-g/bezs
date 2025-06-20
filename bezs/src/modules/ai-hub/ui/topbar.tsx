"use client";

import { Button } from "@/components/ui/button";
import { useChatStore } from "../stores/useChatStore";
import { useRouter } from "next/navigation";

export const Topbar = () => {
  const { sessions, createSession } = useChatStore();
  const router = useRouter();

  return (
    <div>
      <Button size="sm" onClick={() => createSession()}>
        New Session
      </Button>
      {sessions?.map((session) => (
        <div
          key={session.id}
          className="p-2"
          onClick={() => router.push(`/bezs/ai-hub/ask-ai/${session.id}`)}
        >
          {session.title}
        </div>
      )) || "No sessions found"}
    </div>
  );
};
