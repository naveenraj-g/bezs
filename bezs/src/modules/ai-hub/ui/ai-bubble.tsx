"use client";

import { useRef } from "react";
import { TRenderMessageProps } from "./chat/chat-messages";

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { key, humanMessage, aiMessage, loading, model } = props;

  const messageRef = useRef<HTMLDivElement>(null);
};
