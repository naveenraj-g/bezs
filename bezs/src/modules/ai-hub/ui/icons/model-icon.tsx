import { cn } from "@/lib/utils";
import Image from "next/image";

export type TModelIcon = {
  type:
    | "gpt3"
    | "gpt4"
    | "anthropic"
    | "gemini"
    | "groqllama3"
    | "medgemma"
    | "openai";
  size: "sm" | "md" | "lg";
};

export const ModelIcon = ({ type, size }: TModelIcon) => {
  const iconSrc = {
    gpt3: "/model-icons/gpt3.svg",
    gpt4: "/model-icons/gpt4.svg",
    anthropic: "/model-icons/claude.svg",
    gemini: "/model-icons/gemini.svg",
    groqllama3: "/model-icons/groqllama3.svg",
    medgemma: "/model-icons/medgemma.svg",
    openai: "/model-icons/openai.svg",
  };

  return (
    <Image
      src={iconSrc[type]}
      width={0}
      height={0}
      alt={type}
      className={cn(
        "object-cover invert dark:invert-0",
        size === "sm" && "min-w-4 h-4",
        size === "md" && "min-w-6 h-6",
        size === "lg" && "min-w-8 h-8"
      )}
      sizes="100wv"
    />
  );
};
