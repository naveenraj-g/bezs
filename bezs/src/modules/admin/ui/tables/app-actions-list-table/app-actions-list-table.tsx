/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAdminModal } from "../../../stores/use-admin-modal-store";
import DataTable from "@/shared/ui/table/data-table";
import { ManageAppActionsTableDataType } from "@/modules/admin/types/tables/table-data-types";
import { getAppActions } from "@/modules/admin/serveractions/apps/server-actions";
import { appActionsListColumn } from "./app-actions-list-column";

export const AppActionsListTable = ({
  appId,
}: {
  appId: string | undefined;
}) => {
  const openModal = useAdminModal((state) => state.onOpen);
  const triggerRefetch = useAdminModal((state) => state.trigger);

  const [appActionsTableData, setappActionsTableData] =
    useState<ManageAppActionsTableDataType>({
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
        const appMenuItemsDatas = await getAppActions({ appId });

        setappActionsTableData((prevState) => {
          return {
            ...prevState,
            data: appMenuItemsDatas.appActionsData ?? [],
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
          columns={appActionsListColumn}
          data={appActionsTableData.data}
          dataSize={appActionsTableData.total}
          label="All Actions"
          addLabelName="Add Action"
          searchField="actionName"
          isLoading={isLoading}
          error={(appActionsTableData.data.length === 0 && error) || null}
          fallbackText={
            isLoading ? "Loading Actions..." : error ? error : "No Actions"
          }
          openModal={() =>
            openModal({
              type: "addAppAction",
            })
          }
        />
      </div>
    </>
  );
};
