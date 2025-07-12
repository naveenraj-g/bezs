import { AskAIAdminModalProvider } from "@/modules/ai-hub/providers/ask-ai-admin-modal-provider";

const AiHubAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AskAIAdminModalProvider />
      {children}
    </>
  );
};

export default AiHubAdmin;
