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

export const DeleteUserModal = () => {
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const userId = useAdminModal((state) => state.userId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const session = useSession();

  if (!session) return;

  const isModalOpen = isOpen && modalType === "deleteUser";

  async function handleUserDelete(userId: string) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    await authClient.admin.removeUser(
      {
        userId,
      },
      {
        onSuccess() {
          toast("User deleted!");
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
            Delete User
          </DialogTitle>
          <DialogDescription className="mb-6 text-md">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <Button
              className="cursor-pointer"
              onClick={() => handleUserDelete(userId)}
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
