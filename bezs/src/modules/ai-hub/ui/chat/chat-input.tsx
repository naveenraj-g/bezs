"use client";
// 2:47
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { File, Mic, Send, Upload, X } from "lucide-react";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useChatStore } from "../../stores/useChatStore";
import { PromptType, RoleType } from "../../types/chat-types";
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { ModelSelect } from "../model-select";
import { easeInOut, motion } from "framer-motion";

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNewSession =
    currentSession?.messages?.length === 0 && !streamingMessage?.loading;

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

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
          query: prompt,
        },
        sessionId?.toString()
      );
    }

    e.currentTarget.reset();
    setFiles([]);
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

  return (
    <div>
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
      <div className="bg-zinc-300/30 dark:bg-zinc-700/80 rounded-3xl overflow-hidden p-2 border space-y-2">
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
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <Textarea
              ref={textareaRef}
              name="prompt"
              placeholder="Type or Ask anything..."
              required
              onKeyDown={handleKeyDown}
              className="!bg-transparent border-none focus-visible:!border-0 focus-visible:ring-0 shadow-none min-h-9 max-h-24 resize-none"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="bg-transparent dark:hover:!bg-zinc-600/50 rounded-full"
            >
              <Send className="dark:text-white !w-[1.15rem] !h-[1.15rem]" />
            </Button>
          </div>
        </form>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ActionTooltipProvider
              label="Add photos and files"
              align="center"
              side="bottom"
            >
              <div>
                <input
                  ref={fileInputRef}
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
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
          <ActionTooltipProvider label="Dictate" align="center" side="bottom">
            <Button
              size="icon"
              variant="ghost"
              className="bg-transparent dark:hover:!bg-zinc-600/50 rounded-full"
            >
              <Mic className="!w-[1.15rem] !h-[1.15rem]" />
            </Button>
          </ActionTooltipProvider>
        </div>
      </div>
      {isNewSession && (
        <div className="grid grid-cols-2 gap-2 mb-4 max-w-[700px] mx-auto mt-4">
          {examples?.map((example, index) => (
            <div
              key={index}
              className="flex flex-row items-center text-sm py-3 px-4 bg-black/10 dark:bg-white/20 border border-black/5 dark:border-white/30 w-full rounded-2xl hover:bg-black/20 dark:hover:bg-white/10 hover:scale-[101%] cursor-pointer"
              onClick={() => {
                runModel(
                  {
                    role: RoleType.assistant,
                    type: PromptType.ask,
                    query: example,
                  },
                  sessionId!.toString()
                );
              }}
            >
              {example}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
