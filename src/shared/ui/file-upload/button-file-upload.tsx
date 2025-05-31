"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useFileNestUserModal } from "@/modules/filenest/stores/use-filenest-user-modal-store";
import { useTheme } from "next-themes";
import { getSignedURL } from "@/modules/filenest/serveractions/aws-s3-server-action";

type PropsType = {
  uploadUiType?: "dragAndDrop" | "click";
};

export default function ButtonFileUpload({
  uploadUiType = "click",
}: PropsType) {
  const pathName = usePathname();
  const { resolvedTheme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(20);
  const triggerRefetch = useFileNestUserModal(
    (state) => state.incrementTrigger
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Upload file!");
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pathName", pathName ?? "");

      setUploadProgress(0);
      setIsUploading(true);

      try {
        // const res = await axios.post("/api/file/upload", formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        //   onUploadProgress(progressEvent) {
        //     // if (progressEvent.total) {
        //     const percent = Math.round(
        //       (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        //     );
        //     setUploadProgress(percent);
        //     // }
        //   },
        // });

        const signedURLResult = await getSignedURL();

        const url = signedURLResult.url;

        console.log({ url });

        // toast.success(res.data?.message);
        toast.success("Successful!");
        triggerRefetch();
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
  };

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
        className={cn(
          uploadUiType === "dragAndDrop" &&
            "border-2 border-dashed border-primary/20 dark:border-primary/50 rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition",
          uploadUiType === "click" && "w-fit"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="*"
          disabled={isUploading}
        />

        {uploadUiType === "dragAndDrop" ? (
          <div className="flex flex-col items-center justify-center space-y-1">
            <UploadCloud className="w-10 h-10 text-gray-500" />
            <p className="text-sm text-gray-600 flex flex-col items-center space-y-2">
              <span className="text-zinc-900 dark:text-white font-semibold">
                Drag & drop files here
              </span>
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
    </div>
  );
}
