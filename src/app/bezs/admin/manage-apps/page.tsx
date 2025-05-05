import { AppsListTable } from "@/modules/admin/ui/apps-list-table";

const ManageAppsPage = () => {
  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Manage Apps</h1>
        <p className="text-sm">Manage Apps and its functionality.</p>
      </div>
      <AppsListTable />
    </div>
  );
};

export default ManageAppsPage;
