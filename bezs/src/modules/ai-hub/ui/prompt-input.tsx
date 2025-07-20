"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { File, Mic, Send, Upload, X } from "lucide-react";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useChatStore } from "../stores/useChatStore";
import { PromptType, RoleType } from "../types/chat-types";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { useChatContext } from "../context/chat/context";

interface PromptInputPropsType {
  modelName?: string;
  handleChat?: (prompt: string) => void;
  setResponse?: any;
}

export const PromptInput = ({
  modelName,
  handleChat,
  setResponse,
}: PromptInputPropsType) => {
  const params = useParams();
  const sessionId = params?.sessionId;
  const runModel = useChatStore((state) => state.runModel);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // if (!sessionId) return;

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;

    console.log(prompt);

    return;

    // if (prompt !== "") {
    //   runModel(
    //     {
    //       role: RoleType.assistant,
    //       type: PromptType.ask,
    //       query: prompt,
    //     },
    //     sessionId?.toString()
    //   );
    // }

    // if (handleChat) {
    //   handleChat(prompt);
    // }

    const chat = new ChatOpenAI({
      apiKey: "",
      model: "llama3-8b-8192",
      streaming: true,
      configuration: {
        baseURL: `${window.location.origin}/api/groqllama3`, // this hits /chat/completions
      },
    });

    const stream = await chat.stream(prompt);

    for await (const chunk of stream) {
      setResponse((prev: string) => prev + chunk.content);
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
  );
};
