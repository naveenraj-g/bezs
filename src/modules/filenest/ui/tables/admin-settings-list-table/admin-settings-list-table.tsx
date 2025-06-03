"use client";

import { getAllSettingsData } from "@/modules/filenest/serveractions/admin/settings/server-actions";
import { useFileNestAdminModal } from "@/modules/filenest/stores/use-filenest-admin-modal-store";
import { AdminSettingsTableDataType } from "@/modules/filenest/types/tables/table-data-types";
import DataTable from "@/shared/ui/table/data-table";
import { useEffect, useState } from "react";
import { useServerAction } from "zsa-react";
import { adminSettingsListTableColumn } from "./admin-settings-list-table-column";

export const AdminSettingsListTable = () => {
  const openModal = useFileNestAdminModal((state) => state.onOpen);
  const triggerRefetch = useFileNestAdminModal((state) => state.trigger);

  const { execute, isPending, error, isError } =
    useServerAction(getAllSettingsData);

  const [settingsTableData, setSettingsTableData] =
    useState<AdminSettingsTableDataType>({
      data: [],
      total: 0,
    });

  useEffect(() => {
    (async () => {
      const [data] = await execute();
      setSettingsTableData((prevState) => {
        return {
          ...prevState,
          data: data?.settingsData ?? [],
          total: data?.total ?? 0,
        };
      });
    })();
  }, [triggerRefetch, execute]);

  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Settings</h1>
          <p className="text-sm">
            Manage Apps Storage Settings and its functionality.
          </p>
        </div>
        <DataTable
          columns={adminSettingsListTableColumn}
          data={settingsTableData.data}
          dataSize={settingsTableData.total}
          label="All Cloud Storage Credentials"
          addLabelName="Add Credentials"
          searchField="appName"
          isLoading={isPending}
          error={
            (settingsTableData.data.length === 0 && error?.message) || null
          }
          fallbackText={
            isPending
              ? "Loading credentials..."
              : isError
                ? error?.message
                : "No Credentials"
          }
          //   filterField="type"
          //   filterValues={typeFilteredData}
          openModal={() =>
            openModal({
              type: "createSettings",
            })
          }
        />
      </div>
    </>
  );
};
