import {
  AppointmentTablePatient,
  DoctorAppointmentTableDataType,
} from "@/modules/telemedicine/types/data-types";

import { AppointmentStatus } from "../../../../../../prisma/generated/telemedicine";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ProfileAvatar } from "../../profile-image";
import { AppointmentStatusIndicator } from "../../appointments/appointment-status-indicator";
import {
  CalendarCog,
  Check,
  EllipsisVertical,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { TanstackTableColumnSorting } from "@/shared/ui/table/tanstack-table-column-sorting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTelemedicineDoctorModal } from "@/modules/telemedicine/stores/use-telemedicine-doctor-modal-store";
import Link from "next/link";

export const doctorAppointmentsListTableColumn: ColumnDef<DoctorAppointmentTableDataType>[] =
  [
    {
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <TanstackTableColumnSorting
            label="PATIENT"
            column={column}
            isSorted={isSorted}
          />
        );
      },
      accessorKey: "patient",
      filterFn: (row, columnId, filterValue) => {
        const person: AppointmentTablePatient = row.getValue("patient");
        return person.name
          .toLowerCase()
          .includes((filterValue as string).toLowerCase());
      },
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
      header: "MODE",
      accessorKey: "appointment_mode",
      cell: ({ row }) => {
        const appointmentMode: "VIDEO" | "INPERSON" =
          row.getValue("appointment_mode");
        return (
          <span className="capitalize">{appointmentMode.toLowerCase()}</span>
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
        const rowData = row.original;
        const status: AppointmentStatus = row.getValue("status");
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const openModal = useTelemedicineDoctorModal((state) => state.onOpen);

        return (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              className="rounded-full"
              onClick={() =>
                openModal({
                  type: "viewAppointment",
                  appointmentData: rowData,
                })
              }
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
              <DropdownMenuContent align="start" side="right">
                {status === "PENDING" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      openModal({
                        type: "confirmAppointment",
                        appointmentId: id,
                        appointmentData: rowData,
                      })
                    }
                  >
                    <Check />
                    Confirm Appointment
                  </DropdownMenuItem>
                )}
                {(status === "PENDING" || status === "SCHEDULED") && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        openModal({
                          type: "rescheduleAppointment",
                          appointmentId: id,
                          appointmentData: rowData,
                        })
                      }
                    >
                      <CalendarCog />
                      Reschedule Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        openModal({
                          type: "cancelAppointment",
                          appointmentId: id,
                          appointmentData: rowData,
                        })
                      }
                    >
                      <X />
                      Cancel Appointment
                    </DropdownMenuItem>
                  </>
                )}
                {(status === "CANCELLED" || status === "COMPLETED") && (
                  <>
                    {status === "COMPLETED" && <DropdownMenuSeparator />}
                    <DropdownMenuItem className="space-x-2 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Trash2 />
                        Delete
                      </div>
                      <TriangleAlert className="text-rose-600" />
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {rowData.appointment_mode === "VIDEO" &&
              rowData.status === "SCHEDULED" && (
                <Link
                  className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
                  href={`/bezs/tele-medicine/doctor/appointments/video?roomId=${rowData.livekit_room_id}`}
                >
                  Video Chat
                </Link>
              )}
          </div>
        );
      },
    },
  ];
