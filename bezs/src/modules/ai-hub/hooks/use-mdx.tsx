"use client";

import { cn } from "@/lib/utils";
import Markdown from "marked-react";
import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { CodeBlock } from "../ui/chat/codeblock";

export const useMarkdown = () => {
  const renderMarkdown = (message: string): ReactNode => {
    return (
      <Markdown
        renderer={{
          paragraph: (children) => (
            <p className="text-sm leading-7">{children}</p>
          ),
          heading: (children, level) => {
            const Heading = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <Heading className="font-medium text-md">{children}</Heading>
            );
          },
          link: (href, text) => {
            return (
              <Link href={href} target="_blank">
                {text}
              </Link>
            );
          },
          blockquote: (children) => (
            <div>
              <p className="text-sm leading-7">{children}</p>
            </div>
          ),
          list: (children, ordered) => {
            const List = ordered ? "ol" : "ul";
            return (
              <List
                className={cn(ordered ? "list-decimal" : "list-disc", "ml-8")}
              >
                {children}
              </List>
            );
          },
          listItem: (children) => (
            <li className="my-4">
              <p className="text-sm leading-7">{children}</p>
            </li>
          ),
          code: (code, lang) => {
            return (
              <div className="my-8">
                <CodeBlock lang={lang} code={code?.toString()} />
              </div>
            );
          },
          codespan: (code, lang) => {
            return (
              <span className="px-2 py-1 text-xs rounded text-[#41e696] bg-[#41e696]/10">
                {code}
              </span>
            );
          },
        }}
      >
        {message}
      </Markdown>
    );
  };

  return { renderMarkdown };
};
