import { AdminManageModelSettingsTable } from "@/modules/ai-hub/ui/tables/admin-manage-modelSettings/admin-manage-modelSettings-table";

const AiHubSettingsPage = () => {
  return (
    <>
      <div className="space-y-8 mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Model Settings</h1>
          <p className="text-sm">
            Manage Model Settings and its functionality.
          </p>
        </div>
        <AdminManageModelSettingsTable />
      </div>
    </>
  );
};

export default AiHubSettingsPage;
