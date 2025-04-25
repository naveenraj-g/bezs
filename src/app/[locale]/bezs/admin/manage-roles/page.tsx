import { RolesListTable } from "@/modules/admin/ui/roles-list-table";

const ManageRolesPage = () => {
  return (
    <div className="space-y-8 mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Manage Roles</h1>
        <p className="text-sm">
          Define and control user access by creating and editing roles with
          specific permissions.
        </p>
      </div>
      <RolesListTable />
    </div>
  );
};

export default ManageRolesPage;
