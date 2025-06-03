import { ColumnDef } from "@tanstack/react-table";
import { Prisma } from "../../../../../prisma/generated/filenest";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { format } from "date-fns";
import { formatBytes } from "@/utils/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  PencilLine,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react";

export const userFileViewColumn: ColumnDef<
  Prisma.UserFileGetPayload<object>
>[] = [
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
    accessorKey: "fileName",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Updated On"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const updatedDate: Date = row.getValue("updatedAt");

      return format(updatedDate, "do 'of' MMM, yyyy");
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="File Size"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "fileSize",
    cell: ({ row }) => {
      const fileSize: bigint = row.getValue("fileSize");
      const formattedFileSize = formatBytes(Number(fileSize));
      return formattedFileSize;
    },
  },
  {
    header: "Storage Type",
    accessorKey: "filePathType",
    cell: ({ row }) => {
      const storageType: string = row.getValue("filePathType");
      return <span className="capitalize">{storageType.toLowerCase()}</span>;
    },
  },
  {
    header: "Actions",
    id: "action",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Ellipsis className="font-medium" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="left">
            <DropdownMenuItem className="cursor-pointer">
              <User />
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <PencilLine />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="space-x-2 cursor-pointer">
              <div className="flex items-center gap-2">
                <Trash2 />
                Delete
              </div>
              <TriangleAlert className="text-rose-600" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
