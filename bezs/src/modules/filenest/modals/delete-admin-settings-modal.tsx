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
import { useFileNestAdminModal } from "../stores/use-filenest-admin-modal-store";
import { deleteAdminSettings } from "../serveractions/admin/settings/server-actions";
import { useServerAction } from "zsa-react";

export const DeleteRoleModal = () => {
  const closeModal = useFileNestAdminModal((state) => state.onClose);
  const modalType = useFileNestAdminModal((state) => state.type);
  const isOpen = useFileNestAdminModal((state) => state.isOpen);
  const id = useFileNestAdminModal((state) => state.id) || "";
  const triggerRefetch = useFileNestAdminModal(
    (state) => state.incrementTrigger
  );

  const session = useSession();

  const {
    execute: deleteAdminSettingsExecute,
    isPending: deleteAdminSettingsPending,
    reset: deleteAdminSettingsReset,
  } = useServerAction(deleteAdminSettings, {
    onSuccess({ data: { message } }) {
      toast.success(message || "Deleted Successfully!");
      triggerRefetch();
      handleCloseModal();
    },
    onError({ err: { message } }) {
      toast.error("Error!", {
        description: message,
      });
    },
  });

  const isModalOpen = isOpen && modalType === "deleteSettings";

  async function handleDelete() {
    if (!session) {
      return;
    }

    await deleteAdminSettingsExecute({ id: String(id) });
  }

  function handleCloseModal() {
    deleteAdminSettingsReset();
    closeModal();
  }

  if (!session) return;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center">
            Delete Setting
          </DialogTitle>
          <DialogDescription className="mb-6 text-md">
            Are you sure you want to delete this app storage setting? This
            action cannot be undone.
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <Button
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={deleteAdminSettingsPending}
            >
              {deleteAdminSettingsPending ? (
                <>
                  Deleting... <Loader2 className="animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <DialogClose asChild>
              <Button
                className="cursor-pointer"
                disabled={deleteAdminSettingsPending}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
