import { AdminManagePromptsTable } from "@/modules/ai-hub/ui/tables/admin-manage-prompts/admin-manage-prompts-table";

const AiHubManagePromptsPage = () => {
  return (
    <>
      <div className="space-y-8 mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Prompts</h1>
          <p className="text-sm">Manage Prompts and its functionality.</p>
        </div>
        <AdminManagePromptsTable />
      </div>
    </>
  );
};

export default AiHubManagePromptsPage;
