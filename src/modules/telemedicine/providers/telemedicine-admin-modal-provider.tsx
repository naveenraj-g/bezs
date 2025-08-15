"use client";

import { useEffect, useState } from "react";
import { CreateDoctorModal } from "../modals/create-doctor-modal";

export const TelemedicineAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateDoctorModal />
    </>
  );
};
