import { OrganizationListTable } from "@/modules/admin/ui/organizations-list-table";

const ManageOrganizationsPage = () => {
  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Manage Organizations</h1>
        <p className="text-sm">Manage Organizations and members.</p>
      </div>
      <OrganizationListTable />
    </div>
  );
};

export default ManageOrganizationsPage;
