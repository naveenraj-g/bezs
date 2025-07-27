import { AiChat } from "@/modules/ai-hub/ui/ai-chat";
import { ChatInput } from "@/modules/ai-hub/ui/chat/chat-input";

const AskAiPage = () => {
  return (
    <main className="container mx-auto h-full">
      {/* <AiChat /> */}
      <div className="flex flex-col justify-center items-center h-full">
        <ChatInput />
      </div>
    </main>
  );
};

export default AskAiPage;
