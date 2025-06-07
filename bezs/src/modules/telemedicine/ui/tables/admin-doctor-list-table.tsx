"use client";

import DataTable from "@/shared/ui/table/data-table";
import { AdminDoctorTableColumn } from "./table-columns/admin-doctor-list-table-column";
import { useTelemedicineAdminModal } from "../../stores/use-telemedicine-admin-modal-store";

type PropsType = {
  name: string;
  id: string;
  email: string;
  specialization: string;
};

export const AdminDoctorListTable = ({
  doctorsData,
  doctorsSize,
}: {
  doctorsData: PropsType[];
  doctorsSize: number;
}) => {
  const openModal = useTelemedicineAdminModal((state) => state.onOpen);

  return (
    <div className="space-y-8 mx-auto w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <p className="text-sm">Manage Doctors details and create.</p>
      </div>
      <DataTable
        columns={AdminDoctorTableColumn}
        data={doctorsData}
        dataSize={doctorsSize}
        label="Doctors"
        addLabelName="Add Doctors"
        fallbackText="No Doctors found or Create new one."
        openModal={() => openModal({ type: "createDoctor" })}
      />
    </div>
  );
};
