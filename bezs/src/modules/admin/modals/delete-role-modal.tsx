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
import { useAdminModal } from "../stores/use-admin-modal-store";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { deleteRole } from "../serveractions/admin-actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const DeleteRoleModal = () => {
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const roleId = useAdminModal((state) => state.roleId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!session) return;

  const isModalOpen = isOpen && modalType === "deleteRole";

  async function handleRoleDelete() {
    if (session.data?.user.role !== "admin") {
      return;
    }

    try {
      setIsLoading(true);
      await deleteRole({ roleId });
      toast("Organization deleted!");
    } catch (err) {
      toast("Error!", {
        description: (err as Error)?.message,
      });

      setIsLoading(false);
    } finally {
      setIsLoading(false);
      incrementTriggerRefetch();
      closeModal();
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center">
            Delete Role
          </DialogTitle>
          <DialogDescription className="mb-6 text-md">
            Are you sure you want to delete this Role? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <Button
              className="cursor-pointer"
              onClick={handleRoleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Delete <Loader2 className="animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <DialogClose asChild>
              <Button className="cursor-pointer" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
