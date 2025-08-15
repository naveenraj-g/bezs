"use client";

import { useTelemedicinePatientModal } from "../stores/use-telemedicine-patient-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Calendar, Loader2, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDateTime } from "../utils";
import { ProfileAvatar } from "../ui/profile-image";
import { getAppointmentById } from "../serveractions/appointment/appointments-server-action";
import {
  AppointmentStatus,
  Gender,
} from "../../../../prisma/generated/telemedicine";

interface Patient {
  address: string;
  img: string | null;
  id: string;
  name: string;
  date_of_birth: Date;
  gender: Gender;
  phone: string;
}

interface Doctor {
  img: string | null;
  id: string;
  name: string;
  specialization: string;
}

interface Appointment {
  patient: Patient;
  doctor: Doctor;
  type: string;
  time: string;
  id: number;
  note: string | null;
  status: AppointmentStatus;
  created_at: Date;
  updated_at: Date;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  reason: string | null;
}

type AppointmentData = Appointment | null;

export const ViewAppointmentModal = () => {
  const closeModal = useTelemedicinePatientModal((state) => state.onClose);
  const modalType = useTelemedicinePatientModal((state) => state.type);
  const isOpen = useTelemedicinePatientModal((state) => state.isOpen);
  const appointmentId =
    useTelemedicinePatientModal((state) => state.appointmentId) || "";

  const isModalOpen = isOpen && modalType === "viewAppointment";

  const [appointmentData, setAppointmentData] = useState<AppointmentData>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen && appointmentId) {
      (async () => {
        try {
          setError(null);
          setIsLoading(true);
          const data = await getAppointmentById(+appointmentId);
          setAppointmentData(data);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          setError("Failed to get data.");
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [appointmentId, isModalOpen]);

  function handleCloseModal() {
    setAppointmentData(null);
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-[425px] max-h-[95%] md:max-w-2xl 2xl:max-w-3xl p-8 overflow-y-auto">
        {isLoading && !error && (
          <DialogHeader>
            <DialogTitle>Patient Appointment</DialogTitle>
            <p className="flex items-center gap-2 mt-2">
              <Loader2 className="animate-spin" /> Loading...
            </p>
          </DialogHeader>
        )}
        {error && !isLoading && (
          <DialogHeader>
            <DialogTitle>Patient Appointment</DialogTitle>
            <p>{error}</p>
          </DialogHeader>
        )}
        {!isLoading && !error && isModalOpen && (
          <>
            <DialogHeader>
              <DialogTitle>Patient Appointment</DialogTitle>
              <DialogDescription>
                This appointment was booked on the{" "}
                {formatDateTime(appointmentData?.created_at?.toString() ?? "")}
              </DialogDescription>
            </DialogHeader>

            {appointmentData?.status === "CANCELLED" && (
              <div className="bg-yellow-100 p-4 mt-4 rounded-md">
                <span className="font-semibold test-sm">
                  This appointment has been cancelled.
                </span>
                <p className="text-sm">
                  <strong>Reason</strong>: {appointmentData?.reason}
                </p>
              </div>
            )}

            <div className="grid gap-4 py-4">
              <p className="w-fit bg-blue-100 text-blue-600 p-1 rounded text-xs md:text-sm">
                Personal Information
              </p>

              <div className="flex flex-col md:flex-row gap-6 mb-16">
                <div className="flex gap-1 w-full md:w-1/2">
                  <ProfileAvatar
                    imgUrl={appointmentData?.patient?.img || null}
                    name={appointmentData?.patient?.name || ""}
                    size="20"
                  />

                  <div className="space-y-0.5">
                    <h2 className="text-lg md:text-xl font-semibold">
                      {appointmentData?.patient?.name}
                    </h2>

                    <p className="flex items-center gap-2 text-zinc-600">
                      <Calendar size={20} />
                      {/* {calculateAge(appointmentData?.patient?.date_of_birth)} */}
                    </p>

                    <span className="flex items-center text-sm gap-2">
                      <Phone size={16} />
                      {appointmentData?.patient?.phone}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="text-gray-600 capitalize">
                    {appointmentData?.patient?.address}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
