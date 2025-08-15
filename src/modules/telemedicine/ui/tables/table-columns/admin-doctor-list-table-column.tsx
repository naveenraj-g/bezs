"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AdminDoctorsDataType } from "@/modules/telemedicine/types/data-types";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  EllipsisVertical,
  PencilLine,
  Trash2,
  TriangleAlert,
} from "lucide-react";

export const AdminDoctorTableColumn: ColumnDef<AdminDoctorsDataType>[] = [
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
    header: "LICENSE",
    accessorKey: "license_number",
  },
  {
    header: "PHONE",
    accessorKey: "phone",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Specialization"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "specialization",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Joined Date"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date: Date = row.getValue("created_at");
      const formattedDate = format(date, "dd-MMM-yyyy");

      return formattedDate;
    },
  },
  {
    header: "Actions",
    id: "action",
    cell: ({ row }) => {
      const id: string = row.original.id;

      return (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="rounded-full"
            //   onClick={() =>
            //     openModal({ type: "viewAppointment", appointmentId: id })
            //   }
          >
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ size: "icon", variant: "ghost" }),
                "rounded-full"
              )}
            >
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem
                className="cursor-pointer"
                //   onClick={() =>
                //     openModal({ type: "editUser", userId: user.id })
                //   }
              >
                <PencilLine />
                Edit details
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                //   onClick={() =>
                //     openModal({ type: "deleteUser", userId: user.id })
                //   }
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
