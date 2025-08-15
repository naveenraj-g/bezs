"use client";

import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export type TLinkBlock = {
  url: string;
};

export const LinkBlock = ({ url }: TLinkBlock) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ogResult, setOgResult] = useState<any | null>(null);

  const fetchOg = async (url: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/og", { url });

      const data = await res.data;
      const result = data?.result;

      if (result) {
        setOgResult(result);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setOgResult(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url?.trim()?.length > 0) {
      fetchOg(url);
    }
  }, [url]);

  const renderContainer = (children: React.ReactNode, link?: string) => {
    return (
      <div
        className="bg-zinc-100/10 dark:bg-zinc-700 p-3 rounded-xl border border-black/10 hover:scale-[101%] cursor-pointer"
        onClick={() => {
          return link && window.open(link, "_blank");
        }}
      >
        {children}
      </div>
    );
  };

  if (!url?.trim()?.length) {
    return null;
  }

  if (isLoading) {
    return renderContainer(
      <div className="flex flex-row items-start gap-2">
        <Skeleton className="w-6 h-6 rounded-xl" />
        <div className="flex flex-col items-start w-full">
          <Skeleton className="w-[80%] h-[10px] rounded-full" />
          <Skeleton className="w-[50%] h-[10px] rounded-full" />
        </div>
      </div>
    );
  }

  return ogResult && ogResult.ogTitle && ogResult.ogUrl
    ? renderContainer(
        <div className="flex flex-row items-start gap-2">
          <Image
            src={ogResult.favicon}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            className="min-w-6 border border-black/10 rounded-md object-cover"
          />
          <div className="flex flex-col gap-1 items-start w-full">
            <p className="text-sm w-full truncate overflow-hidden">
              {ogResult.ogTitle}
            </p>
            <p className="text-sm text-blue-400">{ogResult.ogUrl}</p>
          </div>
        </div>,
        ogResult.ogUrl
      )
    : renderContainer(
        <div>
          <p className="text-xs text-blue-400">{url}</p>
        </div>,
        url
      );
};
