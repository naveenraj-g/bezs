import { AdminManageAssistantKnowledgeBasedTable } from "@/modules/ai-hub/ui/tables/admin-manage-assistant-knowledgeBased/admin-manage-assistant-knowledgeBased-table";

interface IPageProps {
  searchParams: Promise<{ assistantId?: string; assistantName?: string }>;
}

const AiHubManageKnowledgeBasedPage = async ({ searchParams }: IPageProps) => {
  const { assistantName } = await searchParams;

  return (
    <>
      <div className="space-y-8 mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            Manage Knowledge Based ({assistantName})
          </h1>
          <p className="text-sm">
            Manage Knowledge Based and its functionality.
          </p>
        </div>
        <AdminManageAssistantKnowledgeBasedTable />
      </div>
    </>
  );
};

export default AiHubManageKnowledgeBasedPage;
