"use client";

import { CreateUserModal } from "@/modules/admin/modals/create-user-modal";
import { DeleteUserModal } from "@/modules/admin/modals/delete-user-modal";
import { EditUserModal } from "@/modules/admin/modals/edit-user-modal";
import { useEffect, useState } from "react";
import { CreateOrganizationModal } from "../modals/create-organization-modal";
import { ManageOrgModal } from "../modals/manage-org-members";
import { EditOrgModal } from "../modals/edit-org-modal";
import { DeleteOrgModal } from "../modals/delete-org-modal";
import { CreateRoleModal } from "../modals/create-role-modal";

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
      <CreateOrganizationModal />
      <ManageOrgModal />
      <EditOrgModal />
      <DeleteOrgModal />
      <CreateRoleModal />
    </>
  );
};
