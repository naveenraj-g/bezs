import UsersListTable from "@/modules/admin/ui/users-list-table";

const ManageUsersPage = () => {
  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="text-sm">
          Manage users and their account permissions here.
        </p>
      </div>
      <UsersListTable />
    </div>
  );
};

export default ManageUsersPage;
