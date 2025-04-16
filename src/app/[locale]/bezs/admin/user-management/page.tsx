import UsersListTable from "@/modules/admin/ui/users-list-table";

const UserManagementPage = () => {
  return (
    <div className="p-6 space-y-8 max-w-[1280px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="text-sm">
          Manage users and their account permissions here.
        </p>
      </div>
      <UsersListTable />
    </div>
  );
};

export default UserManagementPage;
