"use client";

import { useEffect, useState } from "react";
import { ViewAppointmentModal } from "../modals/view-appointment-modal";
import { BookAppointmentModal } from "../modals/book-appointment-modal";
import { ViewAppointmentReportPatientModal } from "../modals/view-appointment-report";

export const TelemedicinePatientModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ViewAppointmentModal />
      <BookAppointmentModal />
      <ViewAppointmentReportPatientModal />
    </>
  );
};
