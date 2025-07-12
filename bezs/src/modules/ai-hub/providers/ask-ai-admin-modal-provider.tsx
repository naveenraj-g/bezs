"use client";

import { useEffect, useState } from "react";
import { AdminAddAiModelModal } from "../modals/admin/admin-add-model";
import { DeleteAiModelModal } from "../modals/admin/admin-delete-model";

export const AskAIAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AdminAddAiModelModal />
      <DeleteAiModelModal />
    </>
  );
};
