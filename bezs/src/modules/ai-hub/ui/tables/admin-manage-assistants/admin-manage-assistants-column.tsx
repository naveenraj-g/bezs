import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Assistant } from "../../../../../../prisma/generated/ai-hub";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ellipsis, Eye, PencilLine, Trash2, TriangleAlert } from "lucide-react";
import { useAiHubAdminModal } from "@/modules/ai-hub/stores/use-ai-hub-admin-modal-store";

export const adminManageAssistantsColumn: ColumnDef<Assistant>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Assistant Name"
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
          label="Assistant Description"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original.description;

      return (
        <span
          className="inline-block truncate max-w-[250px] xl:max-w-[450px] 2xl:max-w-full"
          title={description}
        >
          {description}
        </span>
      );
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="System Prompt"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "prompt",
    cell: ({ row }) => {
      const systemPrompt = row.original.prompt;

      return (
        <span
          className="inline-block truncate max-w-[250px] xl:max-w-[450px] 2xl:max-w-full"
          title={systemPrompt}
        >
          {systemPrompt}
        </span>
      );
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Greeting Message"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "greeting_message",
    cell: ({ row }) => {
      const greetingMessage = row.original.greeting_message;

      return (
        <span
          className="inline-block truncate max-w-[250px] xl:max-w-[450px] 2xl:max-w-full"
          title={greetingMessage}
        >
          {greetingMessage}
        </span>
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
      const openModal = useAiHubAdminModal((state) => state.onOpen);

      const promptData = row.original;
      const promptId = row.original.id;
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
                onClick={() => openModal({ type: "editPrompts", promptData })}
              >
                <PencilLine />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({ type: "deletePrompt", id: promptId })
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
