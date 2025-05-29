"use client";

import { useEffect, useState } from "react";
import { CreateAdminCredentialsModal } from "../modals/create-admin-credentials-modal";

export const FileNestAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateAdminCredentialsModal />
    </>
  );
};
