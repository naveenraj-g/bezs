"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { CustomInput } from "@/shared/ui/custom-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useFileNestUserModal } from "../stores/use-filenest-user-modal-store";
import { useEffect, useState } from "react";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1).max(20),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const EditUserFileModal = () => {
  const session = useSession();

  const closeModal = useFileNestUserModal((state) => state.onClose);
  const modalType = useFileNestUserModal((state) => state.type);
  const fileData = useFileNestUserModal((state) => state.fileData) || null;
  const isOpen = useFileNestUserModal((state) => state.isOpen);
  const triggerRefetch = useFileNestUserModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "editFile";

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: fileData?.fileName,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({ name: fileData?.fileName });
    }
  }, [form, fileData?.fileName, isModalOpen]);

  async function onSubmit(values: FormSchemaType) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    const sendData = {
      id: fileData?.id,
      fileId: fileData?.fileId,
      newFileName: values.name,
    };

    console.log(sendData);

    setIsLoading(true);
    try {
      const res = await axios.patch("/api/file/rename", sendData);

      if (res.status === 200) {
        toast.success(res.data.message, {
          richColors: true,
        });
        triggerRefetch();
        handleCloseModal();
      }
    } catch (err) {
      toast.error("Error!", {
        description: (err as Error).message || "Unexpected error occurred.",
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Edit File
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="w-full space-y-4">
                  <p className="text-center">
                    {fileData?.fileName} <br /> ({fileData?.fileSize})
                  </p>
                </div>
                <CustomInput
                  type="input"
                  inputType="text"
                  name="name"
                  label="File Name"
                  placeholder="Enter file name"
                  control={form.control}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Changing...
                  </div>
                ) : (
                  "Change name"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
