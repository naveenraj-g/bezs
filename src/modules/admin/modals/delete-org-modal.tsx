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
import {
  authClient,
  useSession,
} from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";

export const DeleteOrgModal = () => {
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const orgId = useAdminModal((state) => state.orgId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const session = useSession();

  if (!session) return;

  const isModalOpen = isOpen && modalType === "deleteOrg";

  async function handleUserDelete(orgId: string) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    await authClient.organization.delete(
      {
        organizationId: orgId,
      },
      {
        onSuccess() {
          toast("Organization deleted!");
          incrementTriggerRefetch();
          closeModal();
        },
        onError(ctx) {
          toast("Error!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center">
            Delete Organization
          </DialogTitle>
          <DialogDescription className="mb-6 text-md">
            Are you sure you want to delete this Organization? This action
            cannot be undone.
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <Button
              className="cursor-pointer"
              onClick={() => handleUserDelete(orgId)}
            >
              Delete
            </Button>
            <DialogClose asChild>
              <Button className="cursor-pointer">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
