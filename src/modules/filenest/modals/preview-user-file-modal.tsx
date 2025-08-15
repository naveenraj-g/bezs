"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useFileNestUserModal } from "../stores/use-filenest-user-modal-store";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AlertTriangle, Download, Loader2 } from "lucide-react";

export const PrevireUserFileModal = () => {
  const closeModal = useFileNestUserModal((state) => state.onClose);
  const modalType = useFileNestUserModal((state) => state.type);
  const isOpen = useFileNestUserModal((state) => state.isOpen);
  const fileData = useFileNestUserModal((state) => state.fileData) || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const session = useSession();
  const isModalOpen = isOpen && modalType === "previewFile";

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      setError(false);
    }

    return () => {
      setLoading(false);
      setError(false);
    };
  }, [isModalOpen]);

  if (!session || !fileData) return null;

  function handleCloseModal() {
    closeModal();
  }

  if (!session) return;

  const src =
    isModalOpen && fileData?.id && fileData?.fileId
      ? `/api/file/get?id=${fileData.id}&fileId=${fileData.fileId}`
      : "";

  const wrapWithLoading = (element: React.ReactNode) => (
    <div className="w-full flex justify-center items-center min-h-[200px] relative">
      {loading && !error && (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 gap-2 text-sm text-center z-10">
          <AlertTriangle className="h-6 w-6" />
          <p>Failed to load preview. Try downloading instead.</p>
        </div>
      )}
      <div
        className={`${loading || error ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      >
        {element}
      </div>
    </div>
  );

  let filePreviewRenderContent: React.ReactNode = (
    <span>Can&apos;t preview this file</span>
  );

  const onLoad = () => setLoading(false);
  const onError = () => {
    setLoading(false);
    setError(true);
  };

  if (fileData?.fileType.startsWith("image/")) {
    filePreviewRenderContent = wrapWithLoading(
      <Image
        src={src}
        alt={fileData?.fileName || "file"}
        width={250}
        height={250}
        onLoad={onLoad}
        onError={onError}
      />
    );
  } else if (fileData?.fileType === "application/pdf") {
    filePreviewRenderContent = wrapWithLoading(
      <iframe
        src={src}
        className="rounded border w-full h-[400px]"
        onLoad={onLoad}
        onError={onError}
      />
    );
  } else if (
    ["text/plain", "application/json", "text/markdown"].includes(
      fileData?.fileType
    )
  ) {
    filePreviewRenderContent = wrapWithLoading(
      <iframe
        src={src}
        width="100%"
        height="400px"
        className="rounded border p-1.5 text-left text-sm font-mono"
        onLoad={onLoad}
        onError={onError}
      />
    );
  } else if (fileData?.fileType.startsWith("audio/")) {
    filePreviewRenderContent = (
      <audio controls className="w-full mt-4">
        <source src={src} type={fileData.fileType} />
        Your browser does not support the audio element.
      </audio>
    );
  } else if (fileData?.fileType.startsWith("video/")) {
    filePreviewRenderContent = (
      <video controls width="100%" height="auto" className="rounded mt-4">
        <source src={src} type={fileData.fileType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center">
            File Preview
          </DialogTitle>
          {!fileData && (
            <DialogDescription className="text-center text-md">
              File data is missing
            </DialogDescription>
          )}
          {fileData && (
            <>
              <DialogDescription
                className="mb-6 text-center flex flex-col items-center gap-2"
                asChild
              >
                <div className="w-full">
                  <span>
                    {fileData?.fileName} ({fileData?.fileSize})
                  </span>
                  {filePreviewRenderContent}
                </div>
              </DialogDescription>
              <DialogFooter>
                <a
                  href={src}
                  className={cn(buttonVariants())}
                  download
                  target="_blank"
                >
                  <Download />
                  Download
                </a>
              </DialogFooter>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
