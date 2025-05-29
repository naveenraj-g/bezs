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
import { CustomInput } from "@/shared/ui/custom-input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFileNestAdminModal } from "../stores/use-filenest-admin-modal-store";
import { adminCreateCredentialsModalFormSchema } from "../schema/admin-credentials-modal-schema";
import { CloudStorageType } from "../../../../prisma/generated/filenest";
import { Loader2 } from "lucide-react";
import { createAdminCloudStorageCredentials } from "../serveractions/admin/credentials/server-actions";

import { useServerAction } from "zsa-react";

type CreateCredentialsFormSchemaType = z.infer<
  typeof adminCreateCredentialsModalFormSchema
>;

export const CreateAdminCredentialsModal = () => {
  const session = useSession();

  const closeModal = useFileNestAdminModal((state) => state.onClose);
  const modalType = useFileNestAdminModal((state) => state.type);
  const isOpen = useFileNestAdminModal((state) => state.isOpen);
  const triggerRefetch = useFileNestAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "createCredentials";

  const { execute, isPending, reset } = useServerAction(
    createAdminCloudStorageCredentials,
    {
      onSuccess({ data: { message } }) {
        toast.success(message || "Success!");
        triggerRefetch();
        handleCloseModal();
      },
      onError({ err: { message } }) {
        toast.error("Error!", {
          description: message,
        });
      },
    }
  );

  const form = useForm<CreateCredentialsFormSchemaType>({
    resolver: zodResolver(adminCreateCredentialsModalFormSchema),
    defaultValues: {
      name: "",
      type: CloudStorageType.AWS_S3,
      bucketName: "",
      region: "",
      clientId: "",
      clientSecret: "",
      maxFileSize: 0,
    },
  });

  async function onSubmit(values: CreateCredentialsFormSchemaType) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    values.maxFileSize = values.maxFileSize * 1024 * 1024;

    await execute(values);
  }

  function handleCloseModal() {
    form.reset();
    reset();
    closeModal();
  }

  const selectTypeList = Object.values(CloudStorageType).map((val) => {
    return {
      label: val,
      value: val,
    };
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Create Credentials
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <CustomInput
                  type="input"
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  control={form.control}
                />
                <CustomInput
                  type="select"
                  name="type"
                  label="Cloud Storage Type"
                  placeholder="Select a type"
                  control={form.control}
                  selectList={selectTypeList}
                  className="w-full"
                />
                <CustomInput
                  type="input"
                  name="bucketName"
                  label="Bucket Name"
                  placeholder="Enter bucket name"
                  control={form.control}
                />
                <CustomInput
                  type="input"
                  name="region"
                  label="Region"
                  placeholder="Enter region"
                  control={form.control}
                />
                <CustomInput
                  type="input"
                  name="clientId"
                  label="Client Id"
                  placeholder="Enter client id"
                  control={form.control}
                />
                <CustomInput
                  type="input"
                  name="clientSecret"
                  label="Client Secret"
                  placeholder="Enter client secret"
                  control={form.control}
                />
                <CustomInput
                  type="input"
                  inputType="number"
                  name="maxFileSize"
                  label="Max File Size (MB)"
                  placeholder="Enter size (500)"
                  control={form.control}
                />
              </div>

              <Button type="submit" className="w-full">
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Credentials"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
