/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { useServerAction } from "zsa-react";
import {
  getAssistants,
  getModelsForMapAssistantAndRoles,
} from "@/modules/ai-hub/serveractions/admin-server-actions";
import { toast } from "sonner";
import { Assistant, Status } from "../../../../../../prisma/generated/ai-hub";
import { adminManageAssistantsColumn } from "./admin-manage-assistants-column";

export type TModelForAssistant = {
  id: string;
  displayName: string | null;
  modelName: string | null;
} | null;

export type TRolesForAssistant = {
  name: string;
  id: number;
  assistantId: number;
}[];

type TDataType = {
  data: (Assistant & {
    model: TModelForAssistant;
    accessRoles: TRolesForAssistant;
  })[];
  total: number;
};

const status = Object.values(Status);

export const AdminManageAssistantsTable = () => {
  const openModal = useAiHubAdminModal((state) => state.onOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.trigger);
  const setModelsForAssistantMapAndRoles = useAiHubAdminModal(
    (state) => state.setModelsForAssistantMapAndRoles
  );

  const [assistantsTableData, setAssistantsTableData] = useState<TDataType>({
    data: [],
    total: 0,
  });

  const { isPending, error, execute } = useServerAction(getAssistants, {
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
  } = useServerAction(getModelsForMapAssistantAndRoles, {
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
        const [data] = await getModels();
        setModelsForAssistantMapAndRoles({
          models: data?.models ?? [],
          roles: data?.uniqueRoles ?? [],
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    })();
  }, [getModels, setModelsForAssistantMapAndRoles]);

  useEffect(() => {
    (async () => {
      try {
        const [data] = await execute();
        setAssistantsTableData((prevState) => {
          return {
            ...prevState,
            data: data?.assistants ?? [],
            total: data?.total ?? 0,
          };
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    })();
  }, [execute, triggerRefetch]);

  return (
    <>
      <div>
        <DataTable
          columns={adminManageAssistantsColumn}
          data={assistantsTableData.data}
          dataSize={assistantsTableData.total}
          label="All Assistants"
          addLabelName="Add Assistant"
          filterField="status"
          filterValues={status}
          isLoading={isPending || getModelsPending}
          error={
            (assistantsTableData.data.length === 0 &&
              error?.message &&
              getModelsError?.message) ||
            null
          }
          fallbackText={
            isPending || getModelsPending
              ? "Loading assistants..."
              : error?.message
                ? error.message
                : "No assistants found"
          }
          openModal={() =>
            openModal({
              type: "addAssistant",
            })
          }
        />
      </div>
    </>
  );
};
