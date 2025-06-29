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
    <div className="hljs-wrapper">
      <div className="pl-4 pr-2 py-2 w-full flex justify-between items-center">
        <p>{languageLabel}</p>
        <Button size="sm" variant="default" onClick={() => code && copy(code)}>
          {showCopied ? <CheckIcon /> : <Copy />}
          {showCopied ? "copied" : "copy"}
        </Button>
      </div>
      <pre className="hljs-pre w-full overflow-x-auto">
        <code
          className={`hljs language-${language} break-words whitespace-pre-wrap`}
          ref={ref}
        />
      </pre>
    </div>
  );
};

// 1:59
