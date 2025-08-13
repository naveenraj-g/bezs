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
import { AdminEditAiModelModal } from "../modals/admin/admin-edit-model";
import { AdminKnowledgeBasedModal } from "../modals/admin/admin-knowledge-based";
import { AdminAddModelSettingsModal } from "../modals/admin/admin-add-modelSettings";
import { AdminEditModelSettingsModal } from "../modals/admin/admin-edit-modelSettings";
import { DeleteModelSettingsModal } from "../modals/admin/admin-delete-modelSettings";
import { AdminAddKnowledgeBasedModal } from "../modals/admin/admin-add-knowledgebased";

export const AskAIAdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AdminAddAiModelModal />
      <AdminEditAiModelModal />
      <DeleteAiModelModal />
      <AdminAddPromptModal />
      <AdminEditPromptModal />
      <DeletePromptModal />
      <AdminAddAssistantModal />
      <AdminEditAssistantModal />
      <DeleteAssistantModal />
      <AdminKnowledgeBasedModal />
      <AdminAddModelSettingsModal />
      <AdminEditModelSettingsModal />
      <DeleteModelSettingsModal />
      <AdminAddKnowledgeBasedModal />
    </>
  );
};
