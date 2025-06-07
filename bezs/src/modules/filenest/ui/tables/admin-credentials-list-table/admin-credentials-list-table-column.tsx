import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileNestAdminModal } from "@/modules/filenest/stores/use-filenest-admin-modal-store";
import { CredentialDataType } from "@/modules/filenest/types/tables/table-data-types";
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

export const adminCredentialsListTableColumn: ColumnDef<CredentialDataType>[] =
  [
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
      accessorKey: "name",
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="Type"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "type",
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="Bucket Name"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "bucketName",
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="Region"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "region",
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="Max File Size"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "maxFileSize",
      cell: ({ row }) => {
        const maxFileSize: number = row.getValue("maxFileSize");
        const formatedFileSizeInMB = Number(maxFileSize) / 1024 / 1024;

        return <>{formatedFileSizeInMB} MB</>;
      },
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="Client Id"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "clientId",
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="Client Secret"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "clientSecret",
      cell: ({ row }) => {
        const clientSecret: string = row.getValue("clientSecret");

        return (
          <p
            className="truncate max-w-[150px] xl:max-w-[200px] 2xl:max-w-full"
            title={clientSecret}
          >
            {clientSecret}
          </p>
        );
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
                  <User />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => openModal({ type: "editCredentials" })}
                >
                  <PencilLine />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="space-x-2 cursor-pointer"
                  onClick={() => openModal({ type: "deleteCredentials" })}
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
