"use client";

import { useEffect, useState } from "react";
import { CreateUserModal } from "@/modules/admin/modals/create-user-modal";
import { DeleteUserModal } from "@/modules/admin/modals/delete-user-modal";
import { EditUserModal } from "@/modules/admin/modals/edit-user-modal";
import { CreateOrganizationModal } from "../modals/create-organization-modal";
import { ManageOrgMembersModal } from "../modals/manage-org-members";
import { EditOrgModal } from "../modals/edit-org-modal";
import { DeleteOrgModal } from "../modals/delete-org-modal";
import { CreateRoleModal } from "../modals/create-role-modal";
import { EditRoleModal } from "../modals/edit-role-modal";
import { DeleteRoleModal } from "../modals/delete-role-modal";
import { CreateAppModal } from "../modals/create-app-modal";
import { EditAppModal } from "../modals/edit-app-modal";
import { DeleteAppModal } from "../modals/delete-app-modal";
import { CreateAppMenuItemModal } from "../modals/create-appMenuItem-modal";
import { EditAppMenuItemModal } from "../modals/edit-appMenuItem-modal";
import { DeleteAppMenuItemModal } from "../modals/delete-appMenuItem-modal";
import { CreateAppActionModal } from "../modals/create-appAction-modal";
import { EditAppActionModal } from "../modals/edit-appAction-modal";
import { DeleteAppActionModal } from "../modals/delete-appAction-modal";
import { ManageOrgAppsModal } from "../modals/manage-org-apps";

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
      <ManageOrgMembersModal />
      <ManageOrgAppsModal />
      <EditOrgModal />
      <DeleteOrgModal />
      <CreateRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
      <CreateAppModal />
      <EditAppModal />
      <DeleteAppModal />
      <CreateAppMenuItemModal />
      <EditAppMenuItemModal />
      <DeleteAppMenuItemModal />
      <CreateAppActionModal />
      <EditAppActionModal />
      <DeleteAppActionModal />
    </>
  );
};
