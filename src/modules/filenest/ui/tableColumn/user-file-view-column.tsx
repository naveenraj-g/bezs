import { ColumnDef } from "@tanstack/react-table";
import { Prisma } from "../../../../../prisma/generated/filenest";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { format } from "date-fns";
import { formatBytes } from "@/utils/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Ellipsis, Expand, Pencil, X } from "lucide-react";
import { useFileNestUserModal } from "../../stores/use-filenest-user-modal-store";
import { toast } from "sonner";

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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const openModal = useFileNestUserModal((state) => state.onOpen);
      const fileDatas = row.original;
      const fileData = {
        id: fileDatas.id,
        fileId: fileDatas.fileId,
        fileName: fileDatas.fileName,
        fileSize: formatBytes(Number(fileDatas.fileSize)),
        fileType: fileDatas.fileType,
      };

      const handleDownload = async (id: number, fileId: string) => {
        try {
          const response = await fetch(
            `/api/file/get?id=${id}&fileId=${fileId}`
          );

          if (!response.ok) toast.error("Failed to download file");

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const fileName =
            response.headers
              .get("Content-Disposition")
              ?.split("filename=")[1]
              ?.replace(/"/g, "") || "download";

          const tempLink = document.createElement("a");
          tempLink.href = url;
          tempLink.download = fileName;
          document.body.appendChild(tempLink);
          tempLink.click();

          // Cleanup
          window.URL.revokeObjectURL(url);
          tempLink.remove();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error("Failed to download file");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Ellipsis className="font-medium" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="left">
            <DropdownMenuItem
              onClick={() =>
                openModal({
                  type: "previewFile",
                  fileData,
                })
              }
              className="cursor-pointer"
            >
              <Expand className="mr-1 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openModal({
                  type: "editFile",
                  fileData,
                });
              }}
              className="cursor-pointer"
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              // onClick={() => {
              //   const src =
              //     fileData?.id && fileData?.fileId
              //       ? `/api/file/get?id=${fileData.id}&fileId=${fileData.fileId}`
              //       : "";
              //   if (!src) {
              //     toast.error("Something went wrong!");
              //   }
              // }}
              className="cursor-pointer"
            >
              <a
                href={
                  fileData?.id && fileData?.fileId
                    ? `/api/file/get?id=${fileData.id}&fileId=${fileData.fileId}`
                    : ""
                }
                download
                target="_blank"
                className="flex items-center gap-1"
              >
                <Download className="mr-1 h-4 w-4" />
                Download
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 cursor-pointer"
              onClick={() =>
                openModal({
                  type: "deleteFile",
                  fileData,
                })
              }
            >
              <X className="mr-1 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
