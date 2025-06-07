/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { AdminCredentialsTableDataType } from "@/modules/filenest/types/tables/table-data-types";
import { getAllCredentialsData } from "@/modules/filenest/serveractions/admin/credentials/server-actions";
import { useFileNestAdminModal } from "@/modules/filenest/stores/use-filenest-admin-modal-store";
import { adminCredentialsListTableColumn } from "./admin-credentials-list-table-column";
import { CloudStorageType } from "../../../../../../prisma/generated/filenest";

export const AdminCredentialsListTable = () => {
  const openModal = useFileNestAdminModal((state) => state.onOpen);
  const triggerRefetch = useFileNestAdminModal((state) => state.trigger);

  const [credentialsTableData, setCredentialsTableData] =
    useState<AdminCredentialsTableDataType>({
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
        const credentialsDatas = await getAllCredentialsData();

        setCredentialsTableData((prevState) => {
          return {
            ...prevState,
            data: credentialsDatas.credentialsData ?? [],
            total: credentialsDatas.total ?? 0,
          };
        });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch]);

  const typeFilteredData = Object.values(CloudStorageType);

  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Credentials</h1>
          <p className="text-sm">
            Manage Cloud Storage Credentials and its functionality.
          </p>
        </div>
        <DataTable
          columns={adminCredentialsListTableColumn}
          data={credentialsTableData.data}
          dataSize={credentialsTableData.total}
          label="All Cloud Storage Credentials"
          addLabelName="Add Credentials"
          searchField="name"
          isLoading={isLoading}
          error={(credentialsTableData.data.length === 0 && error) || null}
          fallbackText={
            isLoading
              ? "Loading credentials..."
              : error
                ? error
                : "No Credentials"
          }
          filterField="type"
          filterValues={typeFilteredData}
          openModal={() =>
            openModal({
              type: "createCredentials",
            })
          }
        />
      </div>
    </>
  );
};
