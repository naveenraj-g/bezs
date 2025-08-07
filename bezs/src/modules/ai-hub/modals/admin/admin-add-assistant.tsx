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
import { AdminCreateAssistantSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { useServerAction } from "zsa-react";
import { createAssistant } from "../../serveractions/admin-server-actions";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";
import { useClipboard } from "../../hooks/use-clipboard";

type TCreateAssistantForm = z.infer<typeof AdminCreateAssistantSchema>;

export const AdminAddAssistantModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);

  const isModalOpen = isOpen && modalType === "addAssistant";
  const { showCopied, copy } = useClipboard();

  const assistantForm = useForm<TCreateAssistantForm>({
    resolver: zodResolver(AdminCreateAssistantSchema),
    defaultValues: {
      name: "",
      description: "",
      greeting_message: "",
      prompt: "",
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
