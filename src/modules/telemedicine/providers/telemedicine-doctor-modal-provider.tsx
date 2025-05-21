"use client";

import { useEffect, useState } from "react";
import { ConfirmAppointmentDoctorModal } from "../modals/confirm-appointment-doctor-modal";

export const TelemedicineDoctorModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ConfirmAppointmentDoctorModal />
    </>
  );
};
