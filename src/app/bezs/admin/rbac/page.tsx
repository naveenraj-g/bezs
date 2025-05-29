// import { RBACListTable } from "@/modules/admin/ui/rbac/rbac-list-table copy";
import { RBACOrgUserRoleMap } from "@/modules/admin/ui/rbac/rbac-org-user-role-map";
import { RBACListTable } from "@/modules/admin/ui/tables/rbac-list-table/rbac-list-table";

const RBACPage = () => {
  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          RBAC (Role Based Access Control)
        </h1>
        <p className="text-sm">
          Manage user roles and permissions across your organization to control
          access to features and data.
        </p>
      </div>
      <div className="space-y-16">
        <RBACOrgUserRoleMap />
        <RBACListTable />
      </div>
    </div>
  );
};

export default RBACPage;
