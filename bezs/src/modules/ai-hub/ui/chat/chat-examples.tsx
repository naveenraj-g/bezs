"use client";

export type TChatExample = {
  examples: string[];
  onExampleClick: (prompt: string) => void;
};

export const ChatExamples = ({ examples, onExampleClick }: TChatExample) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4 max-w-[700px] mx-auto mt-4">
      {examples?.map((example, index) => (
        <div
          key={index}
          className="flex flex-row items-center text-sm py-3 px-4 bg-black/10 dark:bg-white/20 border border-black/5 dark:border-white/30 w-full rounded-2xl hover:bg-black/20 dark:hover:bg-white/10 hover:scale-[101%] cursor-pointer"
          onClick={() => {
            onExampleClick(example);
          }}
        >
          {example}
        </div>
      ))}
    </div>
  );
};
