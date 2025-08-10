import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiModel } from "../../../../../../prisma/generated/ai-hub";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ellipsis, Eye, PencilLine, Trash2, TriangleAlert } from "lucide-react";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";

export const adminManageModelsColumn: ColumnDef<AiModel>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Display Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "displayName",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Model Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "modelName",
  },
  {
    header: "Model URL",
    accessorKey: "modelUrl",
  },
  {
    header: "Model Key",
    accessorKey: "secretKey",
    cell: ({ row }) => {
      const secretKey: string = row.getValue("secretKey");

      return (
        <p
        // title={clientSecret}
        >
          {"*".repeat(secretKey.length)}
        </p>
      );
    },
  },
  {
    header: "Tokens",
    accessorKey: "tokens",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Created At"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const openModal = useAiHubAdminModal((state) => state.onOpen);

      const modelId: string = row.original.id;
      const modelData = row.original;
      const createdDate: Date = row.getValue("createdAt");
      return (
        <div className="flex items-center justify-between gap-4">
          {format(createdDate, "do 'of' MMM, yyyy")}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Ellipsis className="font-medium" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem className="cursor-pointer">
                <Eye />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => openModal({ type: "editModel", modelData })}
              >
                <PencilLine />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => openModal({ type: "deleteModel", id: modelId })}
              >
                <div className="flex items-center gap-2">
                  <Trash2 />
                  Delete
                </div>
                <TriangleAlert className="text-rose-600" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
