"use client";

import DataTable from "@/shared/ui/table/data-table";
import { AppointmentTableDataType } from "../../types/data-types";
import { appointmentsListTableColumn } from "./table-columns/appointments-list-table-column";
import { AppointmentStatus } from "../../../../../prisma/generated/telemedicine";
import { useTelemedicinePatientModal } from "../../stores/use-telemedicine-patient-modal-store";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";

export const PatientappointmentsListTable = ({
  appointmentsData,
  appointmentsCount,
}: {
  appointmentsData: AppointmentTableDataType[];
  appointmentsCount: number;
}) => {
  const { data } = useSession();

  const openModal = useTelemedicinePatientModal((state) => state.onOpen);

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
        columns={appointmentsListTableColumn}
        data={appointmentsData}
        label="All Appointments"
        fallbackText="No Appointments"
        dataSize={appointmentsCount}
        addLabelName="Book Appointment"
        searchField="doctor"
        filterField="status"
        filterValues={appointmentStatusData}
        openModal={() =>
          openModal({
            type: "bookAppointment",
            mainUserId: data?.user?.id || "",
          })
        }
      />
    </div>
  );
};
