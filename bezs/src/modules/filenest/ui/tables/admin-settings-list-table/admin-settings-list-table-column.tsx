import { ColumnDef } from "@tanstack/react-table";
import { SettingsDataType } from "@/modules/filenest/types/tables/table-data-types";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { useFileNestAdminModal } from "@/modules/filenest/stores/use-filenest-admin-modal-store";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  Eye,
  PencilLine,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react";

export const adminSettingsListTableColumn: ColumnDef<SettingsDataType>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="App Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "appName",
  },
  {
    header: "Storage Type",
    accessorKey: "type",
  },
  {
    header: "Base Path",
    accessorKey: "basePath",
  },
  {
    header: "Sub Folder",
    accessorKey: "subFolder",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Credential Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "credential",
    cell: ({ row }) => {
      const credential: { id: string; name: string; bucketName: string } =
        row.getValue("credential");

      return credential ? credential?.name : "Null";
    },
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
      const openModal = useFileNestAdminModal((state) => state.onOpen);

      // const appId: string | undefined = row.original.id;
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
                <Eye />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  openModal({ type: "editSettings", data: row.original })
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
                    type: "deleteSettings",
                    id: row.original.id,
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
