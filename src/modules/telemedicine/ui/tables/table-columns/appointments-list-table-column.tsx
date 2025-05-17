import {
  AppointmentTableDataType,
  AppointmentTableDoctor,
  AppointmentTablePatient,
} from "@/modules/telemedicine/types/data-types";

import { AppointmentStatus } from "../../../../../../prisma/generated/telemedicine";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ProfileAvatar } from "../../profile-image";
import { ViewAppointment } from "../../appointments/view-appointment";
import { AppointmentStatusIndicator } from "../../appointments/appointment-status-indicator";
import {
  EllipsisVertical,
  PencilLine,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const appointmentsListTableColumn: ColumnDef<AppointmentTableDataType>[] =
  [
    {
      header: "INFO",
      accessorKey: "patient",
      cell: ({ row }) => {
        const patientData: AppointmentTablePatient = row.getValue("patient");
        return (
          <div className="flex items-center gap-2 2xl:gap-3 py-2">
            <ProfileAvatar imgUrl={patientData.img} name={patientData.name} />
            <div className="font-semibold">
              <h3>{patientData.name}</h3>
              <span className="text-xs md:text-sm font-light capitalize">
                {patientData.gender.toLowerCase()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="DATE"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "appointment_date",
      cell: ({ row }) => {
        const date: string = row.getValue("appointment_date");
        const formattedDate = format(date, "MMM dd, yyy");
        return <div>{formattedDate}</div>;
      },
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="TIME"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "time",
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="DOCTOR"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "doctor",
      filterFn: (row, columnId, filterValue) => {
        const doctor: AppointmentTableDoctor = row.getValue("doctor");
        return doctor.name
          .toLowerCase()
          .includes((filterValue as string).toLowerCase());
      },
      cell: ({ row }) => {
        const doctorData: AppointmentTableDoctor = row.getValue("doctor");

        return (
          <div className="flex items-center gap-2 2xl:gap-3 py-2">
            <ProfileAvatar imgUrl={doctorData.img} name={doctorData.name} />
            <div className="font-semibold">
              <h3>{doctorData.name}</h3>
              <span className="text-xs md:text-sm font-light capitalize">
                {doctorData.specialization}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="STATUS"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "status",
      cell: ({ row }) => {
        const status: AppointmentStatus = row.getValue("status");
        return <AppointmentStatusIndicator status={status} />;
      },
    },
    {
      header: "ACTIONS",
      id: "actions",
      cell: ({ row }) => {
        const id: number = row.original.id;
        const status: AppointmentStatus = row.getValue("status");

        return (
          <div className="flex items-center gap-1">
            <ViewAppointment id={id} />
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
                {status === "PENDING" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    //   onClick={() =>
                    //     openModal({ type: "editUser", userId: user.id })
                    //   }
                  >
                    <PencilLine />
                    Edit details
                  </DropdownMenuItem>
                )}
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
