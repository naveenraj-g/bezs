"use client";

import { Button } from "@/components/ui/button";
import { useChatStore } from "../stores/useChatStore";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const Topbar = () => {
  const { sessions, createSession } = useChatStore();
  const router = useRouter();
  const params = useParams();

  return (
    <div className="w-fit">
      <Button size="sm" onClick={() => createSession()}>
        New Session
      </Button>
      {sessions?.map((session) => (
        <div
          key={session.id}
          className={cn(
            "p-2 border mt-2 rounded-md cursor-pointer",
            params?.sessionId === session.id && "bg-gray-400"
          )}
          onClick={() => router.push(`/bezs/ai-hub/ask-ai/${session.id}`)}
        >
          {session.title}
        </div>
      )) || "No sessions found"}
    </div>
  );
};
