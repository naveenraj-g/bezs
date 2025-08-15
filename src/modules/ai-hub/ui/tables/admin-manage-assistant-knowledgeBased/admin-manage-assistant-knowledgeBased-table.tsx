/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/shared/ui/table/data-table";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { useServerAction } from "zsa-react";
import { getKnowledgeBased } from "@/modules/ai-hub/serveractions/admin-server-actions";
import { toast } from "sonner";
import {
  KnowledgeBased,
  KnowledgeBasedType,
} from "../../../../../../prisma/generated/ai-hub";
import { useSearchParams } from "next/navigation";
import { adminManageAssistantKnowledgeBasedColumn } from "./admin-manage-assistant-knowledgeBased-column";
import { WarningCircleIcon } from "@phosphor-icons/react";

type TDataType = {
  data: KnowledgeBased[];
  total: number;
};

const types = Object.values(KnowledgeBasedType);

export const AdminManageAssistantKnowledgeBasedTable = () => {
  const params = useSearchParams();

  const assistantId = params?.get("assistantId");

  const openModal = useAiHubAdminModal((state) => state.onOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.trigger);

  const [
    assistantKnowledgeBasedTableData,
    setAssistantKnowledgeBasedTableData,
  ] = useState<TDataType>({
    data: [],
    total: 0,
  });

  const { isPending, error, execute } = useServerAction(getKnowledgeBased, {
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
        const [data] = await execute({
          assistantId: Number(assistantId),
        });
        setAssistantKnowledgeBasedTableData((prevState) => {
          return {
            ...prevState,
            data: data?.knowledgeBased ?? [],
            total: data?.total ?? 0,
          };
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    })();
  }, [params, execute, triggerRefetch, assistantId]);

  if (!assistantId) {
    return (
      <p className="flex items-center flex-wrap gap-2 text-red-500">
        <WarningCircleIcon size={18} weight="bold" />
        Assistant Id for this knowledge based not found.
      </p>
    );
  }

  return (
    <>
      <div>
        <DataTable
          columns={adminManageAssistantKnowledgeBasedColumn}
          data={assistantKnowledgeBasedTableData.data}
          dataSize={assistantKnowledgeBasedTableData.total}
          label="All Knowledge Based"
          addLabelName="Add Knowledge Based"
          filterField="type"
          filterValues={types}
          isLoading={isPending}
          error={
            (assistantKnowledgeBasedTableData.data.length === 0 &&
              error?.message) ||
            null
          }
          fallbackText={
            isPending
              ? "Loading..."
              : error?.message
                ? error.message
                : "No data found"
          }
          openModal={() =>
            openModal({
              type: "addKnowledgeBased",
              id: assistantId,
            })
          }
        />
      </div>
    </>
  );
};
