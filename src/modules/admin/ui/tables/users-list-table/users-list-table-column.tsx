import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminModal } from "@/modules/admin/stores/use-admin-modal-store";
import { BetterAuthUserType } from "@/modules/admin/types/tables/table-data-types";
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

export const usersListTableColumn: ColumnDef<BetterAuthUserType>[] = [
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
          label="User Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "username",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Email"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "email",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Role"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "role",
  },
  {
    header: "Verified",
    accessorKey: "emailVerified",
    cell: ({ row }) => {
      const isEmailVerified = row.getValue("emailVerified");
      return isEmailVerified ? "Yes" : "No";
    },
  },
  {
    header: "2FA Enabled",
    accessorKey: "twoFactorEnabled",
    cell: ({ row }) => {
      const isTwoFactorEnabled = row.getValue("twoFactorEnabled");
      return isTwoFactorEnabled ? "Yes" : "No";
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

      const userId: string | undefined = row.original.id;
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
                onClick={() => openModal({ type: "editUser", userId })}
              >
                <PencilLine />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => openModal({ type: "deleteUser", userId })}
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
