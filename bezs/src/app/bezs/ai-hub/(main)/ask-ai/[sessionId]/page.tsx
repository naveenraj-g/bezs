import { ChatInput } from "@/modules/ai-hub/ui/chat/chat-input";
import { ChatMessages } from "@/modules/ai-hub/ui/chat/chat-messages";

const ChatSessionPage = async ({
  params,
}: {
  params: { sessionId: string };
}) => {
  const { sessionId } = await params;

  return (
    <div>
      <ChatInput />
      <ChatMessages />
    </div>
  );
};

export default ChatSessionPage;

// 1:35
