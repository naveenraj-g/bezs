"use client";

import { useEffect, useState } from "react";
import { AdminAddAiModelModal } from "../modals/admin/admin-add-model";
import { DeleteAiModelModal } from "../modals/admin/admin-delete-model";
import { AdminAddPromptModal } from "../modals/admin/admin-add-prompts";
import { AdminEditPromptModal } from "../modals/admin/admin-edit-prompts";
import { DeletePromptModal } from "../modals/admin/admin-delete-prompt";
import { AdminAddAssistantModal } from "../modals/admin/admin-add-assistant";
import { AdminEditAssistantModal } from "../modals/admin/admin-edit-assistant";
import { DeleteAssistantModal } from "../modals/admin/admin-delete-assistant";

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
      <AdminAddPromptModal />
      <AdminEditPromptModal />
      <DeletePromptModal />
      <AdminAddAssistantModal />
      <AdminEditAssistantModal />
      <DeleteAssistantModal />
    </>
  );
};
