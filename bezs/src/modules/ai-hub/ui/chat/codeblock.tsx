import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import { Button } from "@/components/ui/button";

export type TCodeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ code, lang }: TCodeBlockProps) => {
  const ref = useRef<HTMLElement>(null);

  const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCOde = hljs.highlight(language, code).value;
      ref.current.innerHTML = highlightedCOde;
    }
  }, [code, language]);

  return (
    <div className="hljs-wrapper">
      <div className="pl-4 pr-2 py-2 w-full flex justify-between items-center">
        <p>{language}</p>
        <Button size="icon" onClick={() => code}>
          Copy
        </Button>
      </div>
      <pre className="hljs-pre">
        <code className={`hljs language-${language}`} ref={ref} />
      </pre>
    </div>
  );
};

// 1:59
