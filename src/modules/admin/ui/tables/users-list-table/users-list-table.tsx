/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { useEffect, useState } from "react";
import { useAdminModal } from "../../../stores/use-admin-modal-store";
import { ManageUsersTableDataType } from "@/modules/admin/types/tables/table-data-types";
import DataTable from "@/shared/ui/table/data-table";
import { usersListTableColumn } from "./users-list-table-column";
import { getAllRolesNameOnly } from "@/modules/admin/serveractions/users/server-actions";

const UsersListTable = () => {
  const openModal = useAdminModal((state) => state.onOpen);
  const triggerRefetch = useAdminModal((state) => state.trigger);

  const [usersTableData, setUsersTableData] =
    useState<ManageUsersTableDataType>({
      data: [],
      total: 0,
      roleData: [],
    });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setIsLoading(true);
        const allUsers = await authClient.admin.listUsers({
          query: {
            limit: undefined,
          },
        });
        const roleDatas = await getAllRolesNameOnly();

        setUsersTableData((prevState) => {
          return {
            ...prevState,
            data: allUsers.data?.users ?? [],
            total: allUsers.data?.total ?? 0,
            roleData: roleDatas ?? [],
          };
        });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch]);

  const roleFilterData = usersTableData.roleData.map((data) => data.name);

  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Users</h1>
          <p className="text-sm">
            Manage users and their account permissions here.
          </p>
        </div>
        <DataTable
          columns={usersListTableColumn}
          data={usersTableData.data}
          dataSize={usersTableData.total}
          label="All Users"
          addLabelName="Add User"
          searchField="name"
          isLoading={isLoading}
          error={(usersTableData.data.length === 0 && error) || null}
          fallbackText={
            isLoading ? "Loading users..." : error ? error : "No Users"
          }
          filterField="role"
          filterValues={roleFilterData}
          openModal={() =>
            openModal({
              type: "addUser",
            })
          }
        />
      </div>
    </>
  );
};

export default UsersListTable;
