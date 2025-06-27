import { useEffect, useRef } from "react";
import hljs from "highlight.js";

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
    }
  }, []);
};

// 1:53
