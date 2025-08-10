/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { adminManageModelsColumn } from "./admin-manage-models-column";
import { useServerAction } from "zsa-react";
import { getModels } from "@/modules/ai-hub/serveractions/admin-server-actions";
import { toast } from "sonner";
import { AiModel } from "../../../../../../prisma/generated/ai-hub";

type TDataType = {
  data: AiModel[];
  total: number;
};

export const AdminManageModelsTable = () => {
  const openModal = useAiHubAdminModal((state) => state.onOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.trigger);

  const [modelsTableData, setmodelsTableData] = useState<TDataType>({
    data: [],
    total: 0,
  });
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const { isPending, error, execute } = useServerAction(getModels, {
    onError(err) {
      toast.error("Error", {
        description: err.err.message,
        richColors: true,
      });
    },
  });

  useEffect(() => {
    (async () => {
      try {
        // setError(null);
        // setIsLoading(true);
        const [data] = await execute();
        setmodelsTableData((prevState) => {
          return {
            ...prevState,
            data: data?.models ?? [],
            total: data?.total ?? 0,
          };
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // setError((error as Error).message);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, [execute, triggerRefetch]);

  return (
    <>
      <div>
        <DataTable
          columns={adminManageModelsColumn}
          data={modelsTableData.data}
          dataSize={modelsTableData.total}
          label="All Actions"
          addLabelName="Add Model"
          searchField=""
          isLoading={isPending}
          error={(modelsTableData.data.length === 0 && error?.message) || null}
          fallbackText={
            isPending
              ? "Loading Models..."
              : error?.message
                ? error.message
                : "No Models"
          }
          openModal={() =>
            openModal({
              type: "addModel",
            })
          }
        />
      </div>
    </>
  );
};
