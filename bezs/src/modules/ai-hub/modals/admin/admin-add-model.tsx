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
import { AdminCreateAiModelSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { AiModelType } from "../../../../../prisma/generated/ai-hub";
import { useServerAction } from "zsa-react";
import { createModel } from "../../serveractions/admin-server-actions";

type CreateModelFormSchemaType = z.infer<typeof AdminCreateAiModelSchema>;

export const AdminAddAiModelModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);

  const isModalOpen = isOpen && modalType === "addModel";

  const modelForm = useForm<CreateModelFormSchemaType>({
    resolver: zodResolver(AdminCreateAiModelSchema),
    defaultValues: {
      displayName: "",
      modelName: "",
      modelUrl: "",
      secretKey: "",
      tokens: "",
      type: "PRE_AVAILABLE",
    },
  });

  const {
    formState: { isSubmitting },
  } = modelForm;

  const { execute } = useServerAction(createModel, {
    onSuccess() {
      toast.success("Model created successfully.", {
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

  async function onAiModelSubmit(values: CreateModelFormSchemaType) {
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
    modelForm.reset();
    closeModal();
  }

  const selectModel = Object.keys(AiModelType).map((modelType) => ({
    label: modelType,
    value: modelType,
  }));

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Create AI Model
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...modelForm}>
            <form
              onSubmit={modelForm.handleSubmit(onAiModelSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <CustomInput
                  type="input"
                  name="displayName"
                  label="Display Name"
                  placeholder="Enter model display name"
                  control={modelForm.control}
                />
                <CustomInput
                  type="input"
                  name="modelName"
                  label="Model Name"
                  placeholder="Enter model name"
                  control={modelForm.control}
                />
                <CustomInput
                  type="input"
                  name="modelUrl"
                  label="Model URL"
                  placeholder="Enter model url"
                  control={modelForm.control}
                />
                <CustomInput
                  type="input"
                  name="secretKey"
                  label="Secret Key"
                  placeholder="Enter model key"
                  control={modelForm.control}
                />
                <CustomInput
                  type="input"
                  name="tokens"
                  label="Tokens"
                  placeholder="Enter model tokens"
                  control={modelForm.control}
                />
                <CustomInput
                  type="select"
                  name="type"
                  label="Model Type"
                  placeholder="select model type"
                  control={modelForm.control}
                  selectList={selectModel}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add Model"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
