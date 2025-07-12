import { AdminManageModelsTable } from "@/modules/ai-hub/ui/tables/admin-manage-models/admin-manage-models-table";

const AiHubManageModelsPage = () => {
  return (
    <>
      <div className="space-y-8 mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage AI Models</h1>
          <p className="text-sm">Manage AI Models and its functionality.</p>
        </div>
        <AdminManageModelsTable />
      </div>
    </>
  );
};

export default AiHubManageModelsPage;
