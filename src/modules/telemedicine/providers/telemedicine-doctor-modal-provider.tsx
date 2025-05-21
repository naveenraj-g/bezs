"use client";

import { useEffect, useState } from "react";
import { ConfirmAppointmentDoctorModal } from "../modals/confirm-appointment-doctor-modal";
import { RescheduleAppointmentDoctorModal } from "../modals/reschedule-appointment-doctor-modal";
import { CancelAppointmentDoctorModal } from "../modals/cancel-appointment-doctor-modal";
import { ViewAppointmentDoctorModal } from "../modals/view-appointment-doctor-modal";

export const TelemedicineDoctorModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ConfirmAppointmentDoctorModal />
      <RescheduleAppointmentDoctorModal />
      <CancelAppointmentDoctorModal />
      <ViewAppointmentDoctorModal />
    </>
  );
};
