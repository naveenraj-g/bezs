"use client";
// 2:47
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CircleStop, File, Mic, Send, Upload, X } from "lucide-react";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useChatStore } from "../../stores/useChatStore";
import { PromptType, RoleType } from "../../types/chat-types";
import { SparkleIcon, StopIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { ModelSelect } from "../model-select";
import { easeInOut, motion } from "framer-motion";
import { useSelectedModelStore } from "../../stores/useSelectedModelStore";
import { useSpeechRecognition } from "../../hooks/use-speech-recognition";
import { VoiceWaveAnimation } from "../voice-wave-animation";
import { useScrollToBottom } from "../../hooks/use-scroll-to-bottom";
import { ArrowDownIcon, QuotesIcon, XIcon } from "@phosphor-icons/react";
import { useTextSelection } from "../../hooks/use-text-selection";
import { ChatExamples } from "./chat-examples";
import { toast } from "sonner";

export type TAttachment = {
  file?: File;
  base64?: string;
};

interface PromptInputPropsType {
  modelName?: string;
}

const slideUpVariant = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easeInOut },
  },
};

const zoomVariant = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: easeInOut, delay: 1 },
  },
};

const examples = [
  "What is quantum computing?",
  "What are qubits?",
  "What is GDP of USA?",
  "What is multi planetary ideology?",
];

export const ChatInput = ({ modelName }: PromptInputPropsType) => {
  const params = useParams();
  const sessionId = params?.sessionId;
  const runModel = useChatStore((state) => state.runModel);
  const currentSession = useChatStore((state) => state.currentSession);
  const streamingMessage = useChatStore((state) => state.streamingMessage);
  const stopGeneration = useChatStore((state) => state.stopGeneration);
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  const { scrollToBottom, showButton } = useScrollToBottom();
  const { selectedText, showPopup, handleClearSelection } = useTextSelection();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contextValue, setContextValue] = useState<string>("");

  const {
    text,
    hasRecoginitionSupport,
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const isNewSession =
    currentSession?.messages?.length === 0 && !streamingMessage?.loading;

  const [attachment, setAttachment] = useState<TAttachment>();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    const fileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file && !fileTypes.includes(file?.type)) {
      toast.message("Please select a valid image (JPEG, PNG, GIF).");
      return;
    }

    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const base64String = reader?.result?.split(",")[1];
      setAttachment((prevState) => ({
        ...prevState,
        base64: `data:${file?.type};base64,${base64String}`,
      }));
    };

    if (file) {
      setAttachment((prevState) => ({
        ...prevState,
        file,
      }));

      reader.readAsDataURL(file);
    }
  };

  // const handleRunModel = () => {
  //   runModel(
  //     {
  //       role: RoleType.assistant,
  //       type: PromptType.ask,
  //       query: prompt,
  //       context: contextValue,
  //     },
  //     sessionId?.toString(),
  //     selectedModel
  //   );

  //   setContextValue("");
  // };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!sessionId) return;

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;

    if (prompt !== "") {
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          image: attachment?.base64,
          query: prompt,
          context: contextValue,
        },
        sessionId?.toString(),
        selectedModel
      );
      setAttachment(undefined);
      setContextValue("");
      e.currentTarget.reset();
      setFiles([]);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevState) => [...selectedFiles, ...prevState]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const renderStopButton = () => {
    if (streamingMessage?.loading) {
      return (
        <span>
          <Button
            onClick={() => stopGeneration()}
            variant="secondary"
            size="sm"
            type="button"
          >
            <StopIcon size={20} weight="bold" /> Stop
          </Button>
        </span>
      );
    }
  };

  return (
    <div className="relative">
      {isNewSession && (
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="text-xl w-14 h-14 border rounded-full bg-black/10 dark:bg-white/10 dark:border-black/10 flex items-center justify-center">
            <SparkleIcon weight="bold" size={24} className="text-green-400" />
          </div>
          <h1 className="text-lg tracking-tight text-zinc-400">
            How can i help you today?
          </h1>
        </div>
      )}
      {showButton && !showPopup && (
        <Button
          onClick={scrollToBottom}
          variant="secondary"
          size="icon"
          className="hover:bg-accent absolute -top-16 rounded-full left-1/2 transform -translate-x-1/2 z-10"
        >
          <ArrowDownIcon size={20} weight="bold" />
        </Button>
      )}
      {showPopup && (
        <div className="flex items-center justify-center absolute -top-16 rounded-full left-1/2 transform -translate-x-1/2">
          <Button
            onClick={() => {
              setContextValue(selectedText);
              handleClearSelection();
              textareaRef?.current?.focus();
            }}
            variant="secondary"
            size="sm"
            className="hover:bg-accent"
          >
            <QuotesIcon size={20} weight="bold" /> Reply
          </Button>
        </div>
      )}
      <div className="bg-zinc-300/30 dark:bg-zinc-700/80 rounded-3xl overflow-hidden p-2 border space-y-2">
        {contextValue && (
          <div className="flex gap-2 justify-between items-center bg-zinc-300 dark:bg-zinc-600 rounded-2xl px-2 py-1">
            <div className="flex items-center gap-2">
              <QuotesIcon size={16} weight="fill" className="shrink-0" />
              <p className="text-sm max-h-20 overflow-y-auto">{contextValue}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setContextValue("")}
              className="shrink-0 hover:bg-transparent dark:hover:bg-transparent"
            >
              <XIcon size={16} weight="bold" />
            </Button>
          </div>
        )}
        {files.length > 0 && (
          <div className="flex gap-2 rounded-xl p-1 overflow-x-auto">
            {files.map((file, index) => {
              const isImageFile = file.type.startsWith("image/");
              const tempImageUrl = isImageFile ? URL.createObjectURL(file) : "";

              return isImageFile ? (
                <div key={index} className="relative basis-12">
                  <Image
                    src={tempImageUrl}
                    alt={file.name}
                    width={48}
                    height={48}
                    className="rounded-xl w-12 h-12 bg-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    type="button"
                    className="text-red-500 bg-red-200 rounded-full absolute -top-0.5 -right-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex items-center gap-2 px-1 py-1 bg-zinc-200 dark:bg-zinc-600/50 text-zinc-700 dark:text-white rounded-lg text-sm"
                >
                  <File className="w-8 h-8" />
                  <div className="flex flex-col">
                    <span className="truncate max-w-[100px]">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    type="button"
                    className="cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {attachment?.base64 && attachment?.file && (
          <div className="relative w-fit">
            <Image
              src={attachment.base64}
              alt={attachment.file.name}
              width={48}
              height={48}
              className="rounded-xl w-12 h-12 bg-cover"
            />
            <button
              onClick={() => setAttachment(undefined)}
              type="button"
              className="text-red-500 bg-red-200 rounded-full absolute -top-0.5 -right-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <Textarea
              ref={textareaRef}
              name="prompt"
              placeholder="Type or Ask anything..."
              required
              onKeyDown={handleKeyDown}
              defaultValue={text}
              className="!bg-transparent border-none focus-visible:!border-0 focus-visible:ring-0 shadow-none min-h-9 max-h-24 resize-none"
            />
            {streamingMessage?.loading ? (
              renderStopButton()
            ) : (
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="bg-transparent dark:hover:!bg-zinc-600/50 rounded-full"
              >
                <Send className="dark:text-white !w-[1.15rem] !h-[1.15rem]" />
              </Button>
            )}
          </div>
        </form>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ActionTooltipProvider
              label="Add images"
              align="center"
              side="bottom"
            >
              <div>
                <input
                  ref={fileInputRef}
                  className="hidden"
                  type="file"
                  onChange={(e) => handleImageUpload(e)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-transparent dark:hover:!bg-zinc-600/50 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="!w-[1.15rem] !h-[1.15rem]" />
                </Button>
              </div>
            </ActionTooltipProvider>
            {modelName ? (
              <Button
                size="sm"
                variant="ghost"
                className="bg-transparent dark:hover:!bg-zinc-600/50 border border-zinc-400"
              >
                {modelName}
              </Button>
            ) : null}
            <ModelSelect />
          </div>
          {!isListening ? (
            <ActionTooltipProvider label="Dictate" align="center" side="bottom">
              <Button
                size="icon"
                variant="ghost"
                className="bg-transparent dark:hover:!bg-zinc-600/50 rounded-full"
                onClick={startListening}
              >
                <Mic className="!w-[1.15rem] !h-[1.15rem]" />
              </Button>
            </ActionTooltipProvider>
          ) : (
            <div className="flex items-center">
              <VoiceWaveAnimation isListening={isListening} />
              <ActionTooltipProvider
                label="Stop Dictate"
                align="center"
                side="bottom"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-transparent text-red-500 hover:text-red-500 dark:hover:!bg-zinc-600/50 rounded-full"
                  onClick={stopListening}
                >
                  <CircleStop className="!w-[1.15rem] !h-[1.15rem]" />
                </Button>
              </ActionTooltipProvider>
            </div>
          )}
        </div>
      </div>
      {isNewSession && (
        <ChatExamples
          examples={examples}
          onExampleClick={(prompt) => {
            runModel(
              {
                role: RoleType.assistant,
                type: PromptType.ask,
                query: prompt,
              },
              sessionId!.toString(),
              selectedModel
            );
          }}
        />
      )}
    </div>
  );
};
