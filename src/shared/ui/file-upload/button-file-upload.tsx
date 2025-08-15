"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { UploadCloud, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useFileNestUserModal } from "@/modules/filenest/stores/use-filenest-user-modal-store";
import { useTheme } from "next-themes";
import { getSignedURL } from "@/modules/filenest/serveractions/aws-s3-server-action";
import { StorageType } from "../../../../prisma/generated/filenest";
import { FileRejection, useDropzone } from "react-dropzone";
import Image from "next/image";

type PropsType = {
  uploadUiType?: "dragAndDrop" | "click";
  uploadStorageType: StorageType | undefined;
  referenceType?: string | null;
  maxSize?: number | undefined;
  testing?: boolean;
};

export default function ButtonFileUpload({
  uploadUiType = "click",
  uploadStorageType,
  referenceType = null,
  maxSize = undefined,
  testing = false,
}: PropsType) {
  const pathName = usePathname();
  const { resolvedTheme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(20);
  const triggerRefetchFn = useFileNestUserModal(
    (state) => state.incrementTrigger
  );

  const handleFileChange = useCallback(
    async (files: File[]) => {
      // const file = e.target.files?.[0];
      const file = files[0];
      if (!file) {
        toast.error("Upload file!");
        return;
      }

      if (!uploadStorageType) {
        toast.error("You can't upload files.", {
          description: "Failed to get upload storage type or not defined.",
        });
      }

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pathName", pathName ?? "");
        if (referenceType) formData.append("referenceType", referenceType);

        setUploadProgress(0);
        setIsUploading(true);

        try {
          if (uploadStorageType === "LOCAL") {
            const res = await axios.post("/api/file/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress(progressEvent) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                );
                setUploadProgress(percent);
              },
            });
          } else if (uploadStorageType === "CLOUD") {
            const signedURLResult = await getSignedURL(file.type, file.size);

            const url = signedURLResult.url;

            const res = await axios.put(url, file, {
              headers: {
                "Content-Type": file.type,
              },
              onUploadProgress(progressEvent) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                );
                setUploadProgress(percent);
              },
            });

            console.log({ url });
          }

          toast.success("Upload successfully!");
          triggerRefetchFn();
        } catch (err) {
          console.log(err);
          toast.error("Error!", {
            description:
              axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : "An unexpected error occurred.",
          });
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    },
    [pathName, referenceType, triggerRefetchFn, uploadStorageType]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (uploadUiType === "click") handleFileChange(acceptedFiles);
      else if (uploadUiType === "dragAndDrop") {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
      }
    },
    [uploadUiType, handleFileChange]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const tooManyFiles = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "too-many-files"
      );
      const fileTooLarge = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "file-too-large"
      );
      const invalidType = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "file-invalid-type"
      );

      if (tooManyFiles) {
        toast.error("You can only upload 1 file at a time.", {
          richColors: true,
        });
      }

      if (fileTooLarge) {
        toast.error("The file size is too large.", {
          richColors: true,
        });
      }

      if (invalidType) {
        toast.error(
          referenceType?.includes("profile")
            ? "Only image files are accepted (e.g. JPG, PNG, GIF)."
            : "Invalid files are not accepted.",
          {
            richColors: true,
          }
        );
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 1,
    maxSize: referenceType?.includes("profile") ? 5 * 1024 * 1024 : maxSize,
    accept: referenceType?.includes("profile") ? { "image/*": [] } : undefined,
  });

  const clearPreview = () => {
    setPreviewUrl(null);
  };

  /*
  return (
    <div className="flex items-center gap-2">
      {isUploading && uploadUiType === "click" && (
        <div className="w-8 h-8">
          <CircularProgressbar
            value={uploadProgress}
            text={`${uploadProgress}%`}
            styles={buildStyles({
              textSize: "30px",
              textColor: resolvedTheme?.includes("dark") ? "#fff" : "#000",
              pathColor: resolvedTheme?.includes("dark") ? "#fff" : "#000",
              trailColor: resolvedTheme?.includes("dark") ? "#333" : "#eee",
            })}
          />
        </div>
      )}
      <div
        {...getRootProps()}
        className={cn(
          uploadUiType === "dragAndDrop" &&
            "w-full border-2 border-dashed border-primary/20 dark:border-primary/50 rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition",
          uploadUiType === "dragAndDrop" &&
            isDragActive &&
            "border-primary bg-primary/5 border-solid",
          uploadUiType === "click" && "w-fit"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          {...getInputProps()}
          ref={fileInputRef}
          type="file"
          className="hidden"
          // onChange={handleFileChange}
          accept="*"
          disabled={isUploading}
        />

        {uploadUiType === "dragAndDrop" ? (
          previewUrl ? (
            <div className="relative w-fit">
              <Image
                src={previewUrl}
                alt="Preview Image"
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
                className="rounded-full border-2 border-primary"
              />
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 bg-white border rounded-full p-1 hover:bg-red-100 transition"
                title="Clear"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1">
              <UploadCloud className="w-10 h-10 text-gray-500" />
              <p className="text-sm text-gray-600 flex flex-col items-center space-y-2">
                {isDragActive ? (
                  <span className="text-zinc-900 dark:text-white font-semibold">
                    Drop the files here...
                  </span>
                ) : (
                  <>
                    <span className="text-zinc-900 dark:text-white font-semibold">
                      Drag & drop files here
                    </span>
                  </>
                )}
                <span className="text-zinc-400 text-sm">
                  or click to browse (max 1 file, up to 5MB each)
                </span>
                <Button size="sm" className="w-fit mt-1">
                  Browse files
                </Button>
              </p>
            </div>
          )
        ) : uploadUiType === "click" ? (
          <Button size="sm" disabled={isUploading}>
            <UploadCloud className="w-5 h-5" />
            Upload File
          </Button>
        ) : null}
      </div>
    </div>
  );
  */

  return (
    <div className="flex flex-col gap-4">
      {/* Image Preview (if exists) */}
      {previewUrl && uploadUiType === "dragAndDrop" && (
        <div className="relative w-fit">
          <div className="relative flex size-40 shrink-0 overflow-hidden rounded-full">
            <Image
              src={previewUrl}
              alt="Preview Image"
              sizes="100vw"
              objectFit="cover"
              fill
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              className="aspect-square size-full"
            />
          </div>
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-white border rounded-full p-1 hover:bg-red-100 transition cursor-pointer"
            title="Clear"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Upload Input UI */}
      <div className="flex items-center gap-2">
        {/* Uploading Indicator */}
        {isUploading && uploadUiType === "click" && (
          <div className="w-8 h-8">
            <CircularProgressbar
              value={uploadProgress}
              text={`${uploadProgress}%`}
              styles={buildStyles({
                textSize: "30px",
                textColor: resolvedTheme?.includes("dark") ? "#fff" : "#000",
                pathColor: resolvedTheme?.includes("dark") ? "#fff" : "#000",
                trailColor: resolvedTheme?.includes("dark") ? "#333" : "#eee",
              })}
            />
          </div>
        )}

        {/* Upload Dropzone / Button */}
        {uploadUiType === "dragAndDrop" && previewUrl ? null : (
          <div
            {...getRootProps()}
            className={cn(
              uploadUiType === "dragAndDrop" &&
                "w-full border-2 border-dashed border-primary/20 dark:border-primary/50 rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition",
              uploadUiType === "dragAndDrop" &&
                isDragActive &&
                "border-primary bg-primary/5 border-solid",
              uploadUiType === "click" && "w-fit"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              {...getInputProps()}
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />

            {uploadUiType === "dragAndDrop" && !previewUrl ? (
              <div className="flex flex-col items-center justify-center space-y-1">
                <UploadCloud className="w-10 h-10 text-gray-500" />
                <p className="text-sm text-gray-600 flex flex-col items-center space-y-2">
                  {isDragActive ? (
                    <span className="text-zinc-900 dark:text-white font-semibold">
                      Drop the files here...
                    </span>
                  ) : (
                    <>
                      <span className="text-zinc-900 dark:text-white font-semibold">
                        Drag & drop files here
                      </span>
                    </>
                  )}
                  <span className="text-zinc-400 text-sm">
                    or click to browse (max 1 file, up to 5MB each)
                  </span>
                  <Button size="sm" className="w-fit mt-1">
                    Browse files
                  </Button>
                </p>
              </div>
            ) : uploadUiType === "click" ? (
              <Button size="sm" disabled={isUploading}>
                <UploadCloud className="w-5 h-5" />
                Upload File
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
