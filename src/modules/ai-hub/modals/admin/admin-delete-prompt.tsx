"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAiHubAdminModal } from "../../stores/use-ai-hub-admin-modal-store";
import { useServerAction } from "zsa-react";
import { deletePrompt } from "../../serveractions/admin-server-actions";

export const DeletePromptModal = () => {
  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const promptId = useAiHubAdminModal((state) => state.id) || "";
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const incrementTriggerRefetch = useAiHubAdminModal(
    (state) => state.incrementTrigger
  );

  const session = useSession();

  const isModalOpen = isOpen && modalType === "deletePrompt";

  const { execute, isPending } = useServerAction(deletePrompt);

  async function handleAppDelete() {
    if (!session) {
      toast.error("Unauthorized!", {
        richColors: true,
      });
      return;
    }

    try {
      const [data, err] = await execute({ promptId });

      if (err) {
        throw new Error(
          typeof err === "string" ? err : err?.message || JSON.stringify(err)
        );
      }
      toast.success("Prompt deleted!", {
        richColors: true,
      });
      incrementTriggerRefetch();
      closeModal();
    } catch (err) {
      toast.error("Error!", {
        description: (err as Error)?.message,
        richColors: true,
      });
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center">
            Delete Prompt
          </DialogTitle>
          <DialogDescription className="mb-6 text-md">
            Are you sure you want to delete this Prompt? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <Button
              className="cursor-pointer"
              onClick={handleAppDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  Delete <Loader2 className="animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <DialogClose asChild>
              <Button className="cursor-pointer" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
