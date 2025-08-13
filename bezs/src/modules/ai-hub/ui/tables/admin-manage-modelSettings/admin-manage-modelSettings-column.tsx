import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ellipsis, Eye, PencilLine, Trash2, TriangleAlert } from "lucide-react";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";
import { TModelSettings } from "./admin-manage-modelSettings-table";

export const adminManageModelSettingsColumn: ColumnDef<TModelSettings>[] = [
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
    accessorKey: "model",
    cell: ({ row }) => {
      const model: { displayName: string | null; modelName: string | null } =
        row.getValue("model");

      return (
        <span>
          {model.displayName} ({model.modelName})
        </span>
      );
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Default Prompt"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "defaultPrompt",
    cell: ({ row }) => {
      const defaultPrompt: string = row.getValue("defaultPrompt");

      return (
        <p className="truncate max-w-[250px] xl:max-w-[450px]">
          {defaultPrompt}
        </p>
      );
    },
  },
  {
    header: "Max Token",
    accessorKey: "maxToken",
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

      const modelSettingsId: number = row.original.id;
      const modelSettingsData = row.original;
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
                onClick={() =>
                  openModal({ type: "editModelSettings", modelSettingsData })
                }
              >
                <PencilLine />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "deleteModelSettings",
                    id: modelSettingsId,
                  })
                }
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
