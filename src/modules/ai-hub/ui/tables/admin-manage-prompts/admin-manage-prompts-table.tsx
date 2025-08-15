/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { useServerAction } from "zsa-react";
import { getPrompts } from "@/modules/ai-hub/serveractions/admin-server-actions";
import { toast } from "sonner";
import { Prompts, Status } from "../../../../../../prisma/generated/ai-hub";
import { adminManagePromptsColumn } from "./admin-manage-prompts-column";

type TDataType = {
  data: Prompts[];
  total: number;
};

const status = Object.values(Status);

export const AdminManagePromptsTable = () => {
  const openModal = useAiHubAdminModal((state) => state.onOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.trigger);

  const [promptsTableData, setPromptsTableData] = useState<TDataType>({
    data: [],
    total: 0,
  });

  const { isPending, error, execute } = useServerAction(getPrompts, {
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
        setPromptsTableData((prevState) => {
          return {
            ...prevState,
            data: data?.prompts ?? [],
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
          columns={adminManagePromptsColumn}
          data={promptsTableData.data}
          dataSize={promptsTableData.total}
          label="All Prompts"
          addLabelName="Add Prompts"
          filterField="status"
          filterValues={status}
          isLoading={isPending}
          error={(promptsTableData.data.length === 0 && error?.message) || null}
          fallbackText={
            isPending
              ? "Loading prompts..."
              : error?.message
                ? error.message
                : "No prompts found"
          }
          openModal={() =>
            openModal({
              type: "addPrompts",
            })
          }
        />
      </div>
    </>
  );
};
