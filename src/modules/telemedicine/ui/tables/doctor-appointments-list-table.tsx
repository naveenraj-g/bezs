"use client";

import DataTable from "@/shared/ui/table/data-table";
import { DoctorAppointmentTableDataType } from "../../types/data-types";
import { AppointmentStatus } from "../../../../../prisma/generated/telemedicine";
import { doctorAppointmentsListTableColumn } from "./table-columns/doctor-appointments-list-table-column";

export const DoctorAppointmentsListTable = ({
  appointmentsData,
  appointmentsCount,
}: {
  appointmentsData: DoctorAppointmentTableDataType[];
  appointmentsCount: number;
}) => {
  const appointmentStatusData = Object.keys(AppointmentStatus).map(
    (key) => AppointmentStatus[key as keyof typeof AppointmentStatus]
  );

  return (
    <div className="space-y-8 mx-auto w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-sm">Manage Appointments.</p>
      </div>
      <DataTable
        columns={doctorAppointmentsListTableColumn}
        data={appointmentsData}
        dataSize={appointmentsCount}
        isAddButton={false}
        label="All Appointments"
        fallbackText="No Appointments"
        searchField="patient"
        filterField="status"
        filterValues={appointmentStatusData}
        // openModal={() =>
        //   openModal({
        //     type: "bookAppointment",
        //     mainUserId: data?.user?.id || "",
        //   })
        // }
      />
    </div>
  );
};
