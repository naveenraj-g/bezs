"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAiHubAdminModal } from "../../stores/use-ai-hub-admin-modal-store";
import { AdminCreateAssistantSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { useServerAction } from "zsa-react";
import { editAssistant } from "../../serveractions/admin-server-actions";
import { useEffect } from "react";
import { Status } from "../../../../../prisma/generated/ai-hub";

type TEditAssistantForm = z.infer<typeof AdminCreateAssistantSchema>;

const statusSelectList = Object.keys(Status).map((status) => ({
  label: status,
  value: status,
}));

export const AdminEditAssistantModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);
  const assistantData = useAiHubAdminModal((state) => state.assistantData);
  const modelsForAssistantMap = useAiHubAdminModal(
    (state) => state.modelsForAssistantMap
  );
  const rolesForAssistantMap = useAiHubAdminModal(
    (state) => state.assistantRoles
  );

  const modelsList = modelsForAssistantMap?.map((model) => {
    return {
      label: (
        <div className="text-xs md:text-sm flex flex-col md:flex-row items-center md:gap-2">
          <p>{model.displayName}</p> <span>({model.modelName})</span>
        </div>
      ),
      value: model.id,
    };
  });

  const rolesList = rolesForAssistantMap?.map((role) => {
    return {
      label: role,
      value: role,
    };
  });

  const isModalOpen = isOpen && modalType === "editAssistant";

  const assistantForm = useForm<TEditAssistantForm>({
    resolver: zodResolver(AdminCreateAssistantSchema),
    defaultValues: {
      modelId: assistantData?.modelId || "",
      name: assistantData?.name || "",
      description: assistantData?.description || "",
      greeting_message: assistantData?.greeting_message || "",
      prompt: assistantData?.prompt || "",
      status: "ACTIVE",
      role: assistantData?.accessRoles?.[0]?.name || "",
    },
  });

  useEffect(() => {
    assistantForm.setValue("name", assistantData?.name || "");
    assistantForm.setValue("description", assistantData?.description || "");
    assistantForm.setValue(
      "greeting_message",
      assistantData?.greeting_message || ""
    );
    assistantForm.setValue("prompt", assistantData?.prompt || "");
    assistantForm.setValue("status", assistantData?.status || "ACTIVE");
    assistantForm.setValue("modelId", assistantData?.modelId || "");
    assistantForm.setValue("role", assistantData?.accessRoles?.[0]?.name || "");
  }, [
    assistantData?.accessRoles,
    assistantData?.description,
    assistantData?.greeting_message,
    assistantData?.modelId,
    assistantData?.name,
    assistantData?.prompt,
    assistantData?.status,
    assistantForm,
  ]);

  const {
    formState: { isSubmitting },
  } = assistantForm;

  const { execute } = useServerAction(editAssistant, {
    onSuccess() {
      toast.success("Assistant Edited.", {
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

  async function handleSubmit(values: TEditAssistantForm) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    if (!assistantData?.id) {
      toast.error("Assistant ID is missing");
      return;
    }

    const assistantValue = {
      id: assistantData.id,
      roleId: assistantData.accessRoles?.[0].id,
      ...values,
    };

    try {
      await execute(assistantValue);
      triggerRefetch();
      handleCloseModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  function handleCloseModal() {
    assistantForm.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Edit Assistant
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="mt-4">
          <Form {...assistantForm}>
            <form
              onSubmit={assistantForm.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <CustomInput
                  type="input"
                  name="name"
                  label="Assistant name"
                  placeholder="Enter assistant name"
                  control={assistantForm.control}
                />
                <CustomInput
                  type="textarea"
                  name="description"
                  label="Description"
                  placeholder="This is assistant, that can help with something."
                  control={assistantForm.control}
                />
                <CustomInput
                  type="textarea"
                  name="prompt"
                  label="System Prompt"
                  placeholder="You're a helpful Assistant. Your role is to help users with their queries."
                  control={assistantForm.control}
                />
                <CustomInput
                  type="textarea"
                  name="greeting_message"
                  label="Greeting Message"
                  placeholder="Hello, How can I help you?"
                  control={assistantForm.control}
                />

                <div className="flex flex-col lg:flex-row lg:gap-4 flex-wrap space-y-4">
                  <div className="flex-1 flex flex-col space-y-2">
                    <CustomInput
                      type="select"
                      name="modelId"
                      label="LLM Model"
                      placeholder="Select model to this assistant"
                      defaultValue={assistantForm.getFieldState("modelId")}
                      control={assistantForm.control}
                      selectList={modelsList}
                      formItemClassName="flex-1"
                      className="lg:w-full "
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="w-fit"
                      onClick={() => assistantForm.setValue("modelId", null)}
                    >
                      Reset Model
                    </Button>
                  </div>
                  <CustomInput
                    type="select"
                    name="status"
                    label="Status"
                    placeholder="Select status of the prompt"
                    defaultValue={assistantForm.getFieldState("status")}
                    control={assistantForm.control}
                    selectList={statusSelectList}
                    formItemClassName="flex-1 lg:self-start"
                    className="lg:w-full"
                  />
                </div>
                <CustomInput
                  type="select"
                  name="role"
                  label="Assign Role to access Assistant"
                  placeholder="Select role"
                  defaultValue={assistantForm.getFieldState("role")}
                  control={assistantForm.control}
                  selectList={rolesList}
                  formItemClassName="flex-1 lg:self-start"
                  className="lg:w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Assistant"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
