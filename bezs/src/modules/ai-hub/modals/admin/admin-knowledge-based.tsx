"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAiHubAdminModal } from "../../stores/use-ai-hub-admin-modal-store";
import { BrainIcon } from "@phosphor-icons/react";

export const AdminKnowledgeBasedModal = () => {
  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "knowledge-based";

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            <BrainIcon size={16} weight="bold" /> Knowledge Based
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>{`An LLM knowledge base is a sophisticated information repository that leverages Large Language Models (LLMs) to understand, process, and generate human-like text based on vast datasets.
 It fundamentally differs from traditional systems by using LLMs as its core processing engine, enabling it to comprehend semantic relationships and context, rather than relying on simple keyword matching.
 This allows the system to dynamically ingest and interpret unstructured data from diverse sources like documents, emails, and web content, transforming scattered information into actionable insights.
 The knowledge base's effectiveness is heavily dependent on the quality and organization of its content, which serves as the "lifeblood" for the LLM's operations.`}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
