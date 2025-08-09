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
import { AdminCreateAssistantSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { useServerAction } from "zsa-react";
import { createAssistant } from "../../serveractions/admin-server-actions";
import { Status } from "../../../../../prisma/generated/ai-hub";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

type TCreateAssistantForm = z.infer<typeof AdminCreateAssistantSchema>;

const statusSelectList = Object.keys(Status).map((status) => ({
  label: status,
  value: status,
}));

export const AdminAddAssistantModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);
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

  const isModalOpen = isOpen && modalType === "addAssistant";

  const assistantForm = useForm<TCreateAssistantForm>({
    resolver: zodResolver(AdminCreateAssistantSchema),
    defaultValues: {
      modelId: "",
      name: "",
      description: "",
      greeting_message: "",
      prompt: "",
      status: "ACTIVE",
      role: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = assistantForm;

  const { execute } = useServerAction(createAssistant, {
    onSuccess() {
      toast.success("Assistant created successfully.", {
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

  async function handleSubmit(values: TCreateAssistantForm) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    try {
      await execute(values);
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
            Create Assistant
          </DialogTitle>
        </DialogHeader>
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
                <div className="flex flex-col lg:flex-row lg:gap-4 items-center flex-wrap space-y-4">
                  <CustomInput
                    type="select"
                    name="modelId"
                    label="LLM Model"
                    placeholder="Select status of the prompt"
                    control={assistantForm.control}
                    selectList={modelsList}
                    formItemClassName="flex-1"
                    className="lg:w-full "
                  />
                  <CustomInput
                    type="select"
                    name="status"
                    label="Status"
                    placeholder="Select model to this assistant"
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
                  control={assistantForm.control}
                  selectList={rolesList}
                  formItemClassName="flex-1 lg:self-start"
                  className="lg:w-full"
                />

                {/* <div className="mt-8">
                  <div className="space-y-2">
                    <p>Assign Role to Assistant</p>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {rolesForAssistantMap.length > 0 &&
                            rolesForAssistantMap?.map((role, index) => {
                              return (
                                <SelectItem key={index} value={role}>
                                  {role}
                                </SelectItem>
                              );
                            })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add Assistant"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
