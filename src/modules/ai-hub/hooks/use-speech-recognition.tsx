"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setText((prev) => prev + transcriptChunk + " "); // Append finalized text only
        } else {
          interimTranscript += transcriptChunk; // Build interim result
        }
      }

      setInterimText(interimTranscript); // Optional: show live result while speaking
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        stopListening();
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      if (isListening) {
        recognition.start(); // Auto-restart
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      const err = "Speech recognition not initialized.";
      toast.error(err, {
        richColors: true,
      });
      return;
    }

    try {
      setText("");
      setInterimText("");
      setIsListening(true);
      recognitionRef.current?.start();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Speech recognition error", {
        description: "Not supported in your browser",
        richColors: true,
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch (err: any) {
      const errMsg = "Failed to stop speech recognition.";
      console.error(errMsg, err);
      toast.error(errMsg);
    }
  };

  return {
    text, // Finalized speech
    interimText, // Optional: Live in-progress speech
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognitionRef.current,
  };
};
