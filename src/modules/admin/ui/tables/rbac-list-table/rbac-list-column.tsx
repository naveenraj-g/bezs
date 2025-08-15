import { RbacListDataType } from "@/modules/admin/types/tables/table-data-types";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { RbacUnmap } from "../../rbac/rbac-unmap";
import { format } from "date-fns";

export const RbacListColumn: ColumnDef<RbacListDataType>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Organization"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "organization",
    cell: ({ row }) => {
      const orgData: {
        name: string;
        id: string;
      } = row.getValue("organization");

      return orgData?.name;
    },
  },
  {
    header: "User",
    accessorKey: "user",
    filterFn: (row, columnId, filterValue) => {
      const userData: {
        name: string;
        id: string;
        email: string;
        username: string | null;
      } = row.getValue("user");
      return userData.name
        .toLowerCase()
        .includes((filterValue as string).toLowerCase());
    },
    cell: ({ row }) => {
      const userData: {
        name: string;
        id: string;
        email: string;
        username: string | null;
      } = row.getValue("user");
      return (
        <p className="truncate max-w-[250px] xl:max-w-[450px] 2xl:max-w-full">
          {userData?.name} (@{userData?.username})
        </p>
      );
    },
  },
  {
    header: "Role",
    accessorKey: "role",
    filterFn: (row, columnId, filterValue) => {
      const roleData: {
        name: string;
        id: string;
      } = row.getValue("role");
      //   return (roleData.name || "")
      //     .toLowerCase()
      //     .includes((filterValue as string).toLowerCase());
      return roleData.name === filterValue;
    },
    cell: ({ row }) => {
      const roleData: {
        name: string;
        id: string;
      } = row.getValue("role");
      return roleData.name;
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
      const joinedDate: Date = row.getValue("createdAt");
      return format(joinedDate, "do 'of' MMM, yyyy");
    },
  },
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => {
      const orgId = row.original.organizationId;
      const roleId = row.original.roleId;
      const userId = row.original.userId;

      return <RbacUnmap orgId={orgId} roleId={roleId} userId={userId} />;
    },
  },
];
