"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { NEXT_PUBLIC_LIVEKIT_URL } from "@/lib/constants/env";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  name: string;
}

export const MediaRoom = ({ chatId, video, audio, name }: MediaRoomProps) => {
  const [token, setToken] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await axios.get(
          `/api/livekit?room=${chatId}&username=${name}`
        );

        setToken(data.data.token);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [chatId, name]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 animate-spin my-4" />
        <p className="text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      className="!bg-white border dark:!bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded-md"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
