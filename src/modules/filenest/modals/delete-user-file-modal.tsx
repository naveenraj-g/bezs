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
import { useFileNestUserModal } from "../stores/use-filenest-user-modal-store";
import axios from "axios";
import { useState } from "react";

export const DeleteUserFileModal = () => {
  const closeModal = useFileNestUserModal((state) => state.onClose);
  const modalType = useFileNestUserModal((state) => state.type);
  const isOpen = useFileNestUserModal((state) => state.isOpen);
  const fileData = useFileNestUserModal((state) => state.fileData) || null;
  const triggerRefetch = useFileNestUserModal(
    (state) => state.incrementTrigger
  );

  const session = useSession();

  const isModalOpen = isOpen && modalType === "deleteFile";

  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!session) {
      toast("unauthorized.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.delete("/api/file/delete", {
        data: fileData!,
      });

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
    setIsLoading(false);
    closeModal();
  }

  if (!session) return;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center">
            Delete File
          </DialogTitle>
          <DialogDescription className="mb-6 text-md" asChild>
            <div className="w-full space-y-4">
              <p className="text-center">
                {fileData?.fileName} <br /> ({fileData?.fileSize})
              </p>
              <p>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>
            </div>
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Deleting... <Loader2 className="animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <DialogClose asChild>
              <Button size="sm" className="cursor-pointer" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
