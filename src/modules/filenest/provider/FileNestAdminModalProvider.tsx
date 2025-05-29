"use client";

import { useEffect, useState } from "react";

export const FileNestAdminModalProvider = () => {
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
