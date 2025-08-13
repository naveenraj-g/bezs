"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAiHubAdminModal } from "../../stores/use-ai-hub-admin-modal-store";
import { AdminCreateKnowledgeBasedSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { useServerAction } from "zsa-react";
import { createKnowledgeBased } from "../../serveractions/admin-server-actions";
import { KnowledgeBasedType } from "../../../../../prisma/generated/ai-hub";
import { useEffect } from "react";

type TCreateKnowledgeBasedForm = z.infer<
  typeof AdminCreateKnowledgeBasedSchema
>;

const knowledgeBasedTypeList = Object.keys(KnowledgeBasedType).map((type) => ({
  label: type,
  value: type,
}));

export const AdminAddKnowledgeBasedModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);
  const assistantId = useAiHubAdminModal((state) => state.id);

  const isModalOpen = isOpen && modalType === "addKnowledgeBased";

  const knowledgeForm = useForm<TCreateKnowledgeBasedForm>({
    resolver: zodResolver(AdminCreateKnowledgeBasedSchema),
    defaultValues: {
      name: "",
      type: KnowledgeBasedType.VectorDB,
      connections: "",
      assistantId: Number(assistantId || 0),
    },
  });

  const {
    formState: { isSubmitting },
  } = knowledgeForm;

  useEffect(() => {
    if (isModalOpen && assistantId) {
      knowledgeForm.setValue("assistantId", Number(assistantId));
    }
  }, [assistantId, isModalOpen, knowledgeForm]);

  const { execute } = useServerAction(createKnowledgeBased, {
    onSuccess() {
      toast.success("Knowledge base created successfully.", {
        richColors: true,
      });
    },
    onError(args) {
      toast.error("Error", {
        description: args.err.message,
        richColors: true,
      });
    },
  });

  async function handleSubmit(values: TCreateKnowledgeBasedForm) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    if (!assistantId) {
      toast.error("Invalid or missing data.");
      return;
    }

    const data = {
      ...values,
      assistantId: Number(assistantId),
    };

    try {
      await execute(data);
      triggerRefetch();
      handleCloseModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  function handleCloseModal() {
    knowledgeForm.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Create Knowledge Based
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...knowledgeForm}>
            <form
              onSubmit={knowledgeForm.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <CustomInput
                  type="input"
                  name="name"
                  label="Knowledge Base Name"
                  placeholder="Enter knowledge base name"
                  control={knowledgeForm.control}
                />
                <CustomInput
                  type="textarea"
                  name="connections"
                  label="Connections"
                  placeholder="Enter connection details (e.g., DB URI)"
                  control={knowledgeForm.control}
                />
                <CustomInput
                  type="select"
                  name="type"
                  label="Type"
                  placeholder="Select type"
                  control={knowledgeForm.control}
                  selectList={knowledgeBasedTypeList}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
