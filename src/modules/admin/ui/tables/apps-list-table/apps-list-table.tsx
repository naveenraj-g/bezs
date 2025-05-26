/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAdminModal } from "../../../stores/use-admin-modal-store";
import DataTable from "@/shared/ui/table/data-table";
import { ManageAppsTableDataType } from "@/modules/admin/types/tables/table-data-types";
import { getAllAppsData } from "@/modules/admin/serveractions/apps/server-actions";
import { appsListTableColumn } from "./apps-list-table-column";

export const AppsListTable = () => {
  const openModal = useAdminModal((state) => state.onOpen);
  const triggerRefetch = useAdminModal((state) => state.trigger);

  const [appsTableData, setAppsTableData] = useState<ManageAppsTableDataType>({
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
        const appDatas = await getAllAppsData();

        setAppsTableData((prevState) => {
          return {
            ...prevState,
            data: appDatas.appsData ?? [],
            total: appDatas.total ?? 0,
          };
        });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch]);

  const typeFilteredData = ["platform", "custom"];

  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Apps</h1>
          <p className="text-sm">Manage Apps and its functionality.</p>
        </div>
        <DataTable
          columns={appsListTableColumn}
          data={appsTableData.data}
          dataSize={appsTableData.total}
          label="All Apps"
          addLabelName="Add App"
          searchField="name"
          isLoading={isLoading}
          error={(appsTableData.data.length === 0 && error) || null}
          fallbackText={
            isLoading ? "Loading users..." : error ? error : "No Users"
          }
          filterField="type"
          filterValues={typeFilteredData}
          openModal={() =>
            openModal({
              type: "addApp",
            })
          }
        />
      </div>
    </>
  );
};
