/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { useServerAction } from "zsa-react";
import {
  getModelSettings,
  getModelsForSettingsSelect,
} from "@/modules/ai-hub/serveractions/admin-server-actions";
import { toast } from "sonner";
import { ModelSettings } from "../../../../../../prisma/generated/ai-hub";
import { adminManageModelSettingsColumn } from "./admin-manage-modelSettings-column";

export type TModelSettings = ModelSettings & {
  model: {
    displayName: string | null;
    modelName: string | null;
  };
};

type TDataType = {
  data: TModelSettings[];
  total: number;
};

export const AdminManageModelSettingsTable = () => {
  const openModal = useAiHubAdminModal((state) => state.onOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.trigger);
  const setModelsForSettings = useAiHubAdminModal(
    (state) => state.setModelsForSettings
  );

  const [modelSettingsTableData, setmodelSettingsTableData] =
    useState<TDataType>({
      data: [],
      total: 0,
    });
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const { isPending, error, execute } = useServerAction(getModelSettings, {
    onError(err) {
      toast.error("Error", {
        description: err.err.message,
        richColors: true,
      });
    },
  });

  const {
    isPending: getModelsPending,
    error: getModelsError,
    execute: getModels,
  } = useServerAction(getModelsForSettingsSelect, {
    onError(err) {
      toast.error("Error", {
        description: err.err.message,
        richColors: true,
      });
    },
  });

  useEffect(() => {
    (async () => {
      const [data] = await getModels();
      setModelsForSettings({ models: data?.models ?? [] });
    })();
  }, [getModels, setModelsForSettings]);

  useEffect(() => {
    (async () => {
      try {
        // setError(null);
        // setIsLoading(true);
        const [data] = await execute();
        setmodelSettingsTableData((prevState) => {
          return {
            ...prevState,
            data: data?.modelSettings ?? [],
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
          columns={adminManageModelSettingsColumn}
          data={modelSettingsTableData.data}
          dataSize={modelSettingsTableData.total}
          label="All Model Settings"
          addLabelName="Add Model Settings"
          searchField=""
          isLoading={isPending || getModelsPending}
          error={
            (modelSettingsTableData.data.length === 0 &&
              error?.message &&
              getModelsError?.message) ||
            null
          }
          fallbackText={
            isPending || getModelsPending
              ? "Loading Model Settings..."
              : error?.message
                ? error.message
                : "No Model Settings Found"
          }
          openModal={() =>
            openModal({
              type: "addModelSettings",
            })
          }
        />
      </div>
    </>
  );
};
