/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { RbacListTableDataType } from "@/modules/admin/types/tables/table-data-types";
import { getRBACuserRole } from "@/modules/admin/serveractions/apps/server-actions";
import { useAdminModal } from "../../../stores/use-admin-modal-store";
import { RbacListColumn } from "./rbac-list-column";
import { getAllRolesNameOnly } from "@/modules/admin/serveractions/users/server-actions";

export const RBACListTable = () => {
  const triggerRefetch = useAdminModal((state) => state.trigger);

  const [rbacTableData, setRbacTableData] = useState<RbacListTableDataType>({
    data: [],
    total: 0,
  });
  const [roleData, setRoleData] = useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setIsLoading(true);
        const appMenuItemsDatas = await getRBACuserRole();

        setRbacTableData((prevState) => {
          return {
            ...prevState,
            data: appMenuItemsDatas.rbacData ?? [],
            total: appMenuItemsDatas.total ?? 0,
          };
        });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch]);

  useEffect(() => {
    (async () => {
      const roleDatas = await getAllRolesNameOnly();
      setRoleData(roleDatas || []);
    })();
  }, []);

  const roleFilterData = roleData.map((data) => data.name);

  return (
    <>
      <div className="mx-auto w-full">
        <DataTable
          columns={RbacListColumn}
          data={rbacTableData.data}
          dataSize={rbacTableData.total}
          label="RBAC Datas"
          isAddButton={false}
          searchField="user"
          isLoading={isLoading}
          filterField="role"
          filterValues={roleFilterData}
          error={(rbacTableData.data.length === 0 && error) || null}
          fallbackText={
            isLoading
              ? "Loading RBAC Datas..."
              : error
                ? error
                : "No RBAC Datas"
          }
        />
      </div>
    </>
  );
};
