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
import { Check, Copy, Info, Loader2 } from "lucide-react";
import { useAiHubAdminModal } from "../../stores/use-ai-hub-admin-modal-store";
import { AdminCreatePromptsSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { useServerAction } from "zsa-react";
import { editPrompt } from "../../serveractions/admin-server-actions";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { useClipboard } from "../../hooks/use-clipboard";
import { useEffect } from "react";

type CreatePromptFormSchemaType = z.infer<typeof AdminCreatePromptsSchema>;

export const AdminEditPromptModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);
  const promptData = useAiHubAdminModal((state) => state.promptData);

  const isModalOpen = isOpen && modalType === "editPrompts";
  const { showCopied, copy } = useClipboard();

  const promptForm = useForm<CreatePromptFormSchemaType>({
    resolver: zodResolver(AdminCreatePromptsSchema),
    defaultValues: {
      name: promptData?.name || "",
      description: promptData?.description || "",
    },
  });

  useEffect(() => {
    promptForm.setValue("name", promptData?.name || "");
    promptForm.setValue("description", promptData?.description || "");
  }, [isModalOpen, promptData?.description, promptData?.name, promptForm]);

  const {
    formState: { isSubmitting },
  } = promptForm;

  const { execute } = useServerAction(editPrompt, {
    onSuccess() {
      toast.success("Prompt Edited.", {
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

  async function handleSubmit(values: CreatePromptFormSchemaType) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    if (!promptData?.id) {
      toast.error("Prompt ID is missing");
      return;
    }

    const promptValue = {
      id: promptData.id,
      ...values,
    };

    try {
      await execute(promptValue);
      triggerRefetch();
      handleCloseModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  function handleCloseModal() {
    promptForm.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Edit Prompt
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...promptForm}>
            <form
              onSubmit={promptForm.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <CustomInput
                  type="input"
                  name="name"
                  label="Name"
                  placeholder="Enter prompt name"
                  control={promptForm.control}
                />
                <CustomInput
                  type="textarea"
                  name="description"
                  label="Description"
                  placeholder="Enter prompt description"
                  control={promptForm.control}
                />
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                <p className="text-sm flex gap-1 items-center flex-wrap text-zinc-500 dark:text-zinc-400">
                  <Info className="h-4 w-4" />
                  <span>
                    Add{" "}
                    <b className="text-black dark:text-white">
                      {"{{{{{{{{ input }}}}}}}}"}
                    </b>{" "}
                    for user input context in description.
                  </span>
                </p>
                <ActionTooltipProvider label="Copy">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copy("{{{{{{{{ input }}}}}}}}")}
                    type="button"
                    className="text-zinc-500 dark:text-zinc-400"
                  >
                    {showCopied ? (
                      <Check className="h-4 w-4 cursor-pointer" />
                    ) : (
                      <Copy className="h-4 w-4 cursor-pointer" />
                    )}
                  </Button>
                </ActionTooltipProvider>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Prompt"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
