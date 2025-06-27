import { ChatInput } from "@/modules/ai-hub/ui/chat/chat-input";
import { ChatMessages } from "@/modules/ai-hub/ui/chat/chat-messages";

const ChatSessionPage = async ({
  params,
}: {
  params: { sessionId: string };
}) => {
  const { sessionId } = await params;

  return (
    <div className="flex-1 flex flex-col">
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;
