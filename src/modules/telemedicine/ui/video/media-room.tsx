"use client";

import { useEffect, useRef, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { NEXT_PUBLIC_LIVEKIT_URL } from "@/lib/constants/env";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  name: string;
}

export const MediaRoom = ({ chatId, video, audio, name }: MediaRoomProps) => {
  const [token, setToken] = useState();
  const egreesId = useRef("");

  useEffect(() => {
    (async () => {
      try {
        const data = await axios.get(
          `/api/livekit?room=${chatId}&username=${name}`
        );

        setToken(data.data.token);
      } catch (err) {
        console.log((err as Error).message);
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
    <>
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
      <div className="space-x-4 mt-4">
        <Button
          size="sm"
          onClick={async () => {
            try {
              const resData = await axios.post("/api/livekit-record", {
                roomName: chatId,
              });
              egreesId.current = resData.data.egressId;
              console.log(resData.data);
              toast.success("Start Recording.");
            } catch (error) {
              console.error("Failed to start recording", error);
              toast.error("Failed to start recording");
            }
          }}
        >
          Start Recording
        </Button>
        <Button
          size="sm"
          onClick={async () => {
            try {
              await axios.delete("/api/livekit-record", {
                egressId: egreesId.current,
              });
              alert("Recording started!");
            } catch (error) {
              console.error("Failed to start recording", error);
              alert("Failed to start recording");
            }
          }}
        >
          Stop Recording
        </Button>
      </div>
    </>
  );
};
