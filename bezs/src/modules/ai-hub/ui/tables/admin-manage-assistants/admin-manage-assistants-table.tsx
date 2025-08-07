/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { useServerAction } from "zsa-react";
import { getAssistants } from "@/modules/ai-hub/serveractions/admin-server-actions";
import { toast } from "sonner";
import { Assistant } from "../../../../../../prisma/generated/ai-hub";
import { adminManageAssistantsColumn } from "./admin-manage-assistants-column";

type TDataType = {
  data: Assistant[];
  total: number;
};

export const AdminManageAssistantsTable = () => {
  const openModal = useAiHubAdminModal((state) => state.onOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.trigger);

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
          searchField=""
          isLoading={isPending}
          error={
            (assistantsTableData.data.length === 0 && error?.message) || null
          }
          fallbackText={
            isPending
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
