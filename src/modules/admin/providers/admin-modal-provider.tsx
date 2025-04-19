"use client";

import { CreateUserModal } from "@/modules/admin/modals/create-user-modal";
import { DeleteUserModal } from "@/modules/admin/modals/delete-user-modal";
import { EditUserModal } from "@/modules/admin/modals/edit-user-modal";
import { useEffect, useState } from "react";

export const AdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <DeleteUserModal />
      <CreateUserModal />
      <EditUserModal />
    </>
  );
};
