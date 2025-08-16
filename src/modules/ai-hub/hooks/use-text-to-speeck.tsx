"use client";

import { useRef, useCallback, useState } from "react";
import { toast } from "sonner";

export function useTextToSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
    utteranceRef.current = null;
  }, []);

  const start = useCallback(
    (text: string) => {
      try {
        if (!("speechSynthesis" in window)) {
          toast.error("Text-to-Speech not supported", {
            description: "Your browser does not support speech synthesis.",
          });
          return;
        }

        // Stop any ongoing speech
        stop();

        if (!text || text.trim() === "") {
          toast.error("Empty text", {
            description: "Cannot speak empty text.",
          });
          return;
        }

        setIsLoading(true);

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onstart = () => {
          setIsLoading(false);
          setIsSpeaking(true);
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          setIsLoading(false);
          if (event.error === "interrupted") return;
          toast.error("Speech error", {
            description: event.error || "An unknown error occurred.",
          });
          stop();
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err: any) {
        setIsSpeaking(false);
        setIsLoading(false);
        toast.error("Speech failed", {
          description: err?.message || "Unknown error",
        });
      }
    },
    [stop]
  );

  return { start, stop, isLoading, isSpeaking };
}
