/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAdminModal } from "../../../stores/use-admin-modal-store";
import DataTable from "@/shared/ui/table/data-table";
import { ManageAppMenuItemsTableDataType } from "@/modules/admin/types/tables/table-data-types";
import { getAppMenuItems } from "@/modules/admin/serveractions/apps/server-actions";
import { appMenuItemsListColumn } from "./app-menuItems-list-column";

export const AppMenuItemsListTable = ({
  appId,
}: {
  appId: string | undefined;
}) => {
  const openModal = useAdminModal((state) => state.onOpen);
  const triggerRefetch = useAdminModal((state) => state.trigger);

  const [appMenuItemsTableData, setappMenuItemsTableData] =
    useState<ManageAppMenuItemsTableDataType>({
      data: [],
      total: 0,
    });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setIsLoading(true);
        const appMenuItemsDatas = await getAppMenuItems({ appId });

        setappMenuItemsTableData((prevState) => {
          return {
            ...prevState,
            data: appMenuItemsDatas.appMenuItemsData ?? [],
            total: appMenuItemsDatas.total ?? 0,
          };
        });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch, appId]);

  return (
    <>
      <div>
        <DataTable
          columns={appMenuItemsListColumn}
          data={appMenuItemsTableData.data}
          dataSize={appMenuItemsTableData.total}
          label="All Menu Items"
          addLabelName="Add Menu Item"
          searchField="name"
          isLoading={isLoading}
          error={(appMenuItemsTableData.data.length === 0 && error) || null}
          fallbackText={
            isLoading
              ? "Loading menu items..."
              : error
                ? error
                : "No Menu Items"
          }
          openModal={() =>
            openModal({
              type: "addAppMenuItem",
              appId,
            })
          }
        />
      </div>
    </>
  );
};
