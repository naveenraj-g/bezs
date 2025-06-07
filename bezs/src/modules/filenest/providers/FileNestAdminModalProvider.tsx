"use client";

import { useEffect, useState } from "react";
import { CreateAdminCredentialsModal } from "../modals/create-admin-credentials-modal";
import { CreateAdminSettingsModal } from "../modals/create-admin-settings-modal";
import { EditAdminSettingsModal } from "../modals/edit-admin-settings-modal";
import { DeleteRoleModal } from "../modals/delete-admin-settings-modal";

export const FileNestAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateAdminCredentialsModal />
      <CreateAdminSettingsModal />
      <EditAdminSettingsModal />
      <DeleteRoleModal />
    </>
  );
};
