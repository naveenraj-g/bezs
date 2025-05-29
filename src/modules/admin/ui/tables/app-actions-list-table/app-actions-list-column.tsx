import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminModal } from "@/modules/admin/stores/use-admin-modal-store";
import { AppActionsDataType } from "@/modules/admin/types/tables/table-data-types";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ellipsis,
  PencilLine,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react";

export const appActionsListColumn: ColumnDef<AppActionsDataType>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "actionName",
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");
      return (
        <p
          className="truncate max-w-[250px] xl:max-w-[450px] 2xl:max-w-full"
          title={desc}
        >
          {desc}
        </p>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "actionType",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Joined"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const openModal = useAdminModal((state) => state.onOpen);

      const appActionId: string | undefined = row.original.id;
      const joinedDate: Date = row.getValue("createdAt");
      return (
        <div className="flex items-center justify-between gap-4">
          {format(joinedDate, "do 'of' MMM, yyyy")}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Ellipsis className="font-medium" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem className="cursor-pointer">
                <User />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  openModal({ type: "editAppMenuItem", appActionId })
                }
              >
                <PencilLine />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({ type: "deleteAppMenuItem", appActionId })
                }
              >
                <div className="flex items-center gap-2">
                  <Trash2 />
                  Delete user
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
