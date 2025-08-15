import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAdminModal } from "@/modules/admin/stores/use-admin-modal-store";
import { AppDataType } from "@/modules/admin/types/tables/table-data-types";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ellipsis,
  Lock,
  PencilLine,
  SquareMenu,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react";
import Link from "next/link";

export const appsListTableColumn: ColumnDef<AppDataType>[] = [
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
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Slug"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "slug",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Menu Items",
    cell: ({ row }) => {
      type CountType = {
        appMenuItems: number;
        appActions: number;
      };

      const count: CountType = row.original._count;
      const appId = row.original.id;

      return (
        <div>
          <Link
            href={`/bezs/admin/manage-apps/manage-menus?appId=${appId}`}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "flex items-center cursor-pointer w-fit"
            )}
          >
            <SquareMenu /> ({count.appMenuItems})
          </Link>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      type CountType = {
        appMenuItems: number;
        appActions: number;
      };

      const count: CountType = row.original._count;
      const appId = row.original.id;

      return (
        <div>
          <Link
            href={`/bezs/admin/manage-apps/manage-actions?appId=${appId}`}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "flex items-center cursor-pointer w-fit"
            )}
          >
            <Lock /> ({count.appActions})
          </Link>
        </div>
      );
    },
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

      const appId: string | undefined = row.original.id;
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
                onClick={() => openModal({ type: "editApp", appId })}
              >
                <PencilLine />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => openModal({ type: "deleteApp", appId })}
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
