import { AdminManageAssistantsTable } from "@/modules/ai-hub/ui/tables/admin-manage-assistants/admin-manage-assistants-table";

const AiHubManageAssistantsPage = () => {
  return (
    <>
      <div className="space-y-8 mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Assistants</h1>
          <p className="text-sm">Manage Assistants and its functionality.</p>
        </div>
        <AdminManageAssistantsTable />
      </div>
    </>
  );
};

export default AiHubManageAssistantsPage;
