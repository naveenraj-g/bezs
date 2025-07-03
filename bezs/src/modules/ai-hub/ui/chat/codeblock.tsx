import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import { Button } from "@/components/ui/button";
import { useClipboard } from "../../hooks/use-clipboard";
import { CheckIcon, Copy } from "lucide-react";

export type TCodeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ code, lang }: TCodeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const { copiedText, copy, showCopied } = useClipboard();

  // const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
  const language =
    lang || hljs.highlightAuto(code || "").language || "plaintext";

  const languageLabel =
    {
      js: "JavaScript",
      ts: "TypeScript",
      cpp: "C++",
      py: "Python",
      plaintext: "Plain Text",
    }[language] || language;

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(language, code).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <div className="bg-black/10 dark:bg-white/10 rounded-2xl p-4">
      <div className=" py-2 pb-4 w-full flex justify-between items-center capitalize">
        <p>{languageLabel}</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => code && copy(code)}
          className="bg-transparent"
        >
          {showCopied ? <CheckIcon /> : <Copy />}
          {showCopied ? "copied" : "copy"}
        </Button>
      </div>
      <pre>
        <code
          className={`hljs language-${language} sm:break-words sm:whitespace-pre-wrap overflow-x-auto w-full inline-block pr-[100%] text-sm`}
          ref={ref}
        />
      </pre>
    </div>
  );
};

// 1:59
