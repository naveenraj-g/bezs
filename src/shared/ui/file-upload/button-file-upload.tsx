"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud, File, X } from "lucide-react";
import React, { useRef, useState } from "react";

type PropsType = {
  uploadUiType?: "dragAndDrop" | "click";
};

export default function ButtonFileUpload({
  uploadUiType = "click",
}: PropsType) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  console.log(selectedFile);

  return (
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
      />

      {!selectedFile ? (
        uploadUiType === "dragAndDrop" ? (
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
          <Button size="sm">
            <UploadCloud className="w-5 h-5" />
            Upload File
          </Button>
        ) : null
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <File className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
          </div>
          <Button size="icon" variant="ghost" onClick={handleRemoveFile}>
            <X className="w-5 h-5 text-red-500 hover:text-red-700" />
          </Button>
        </div>
      )}
    </div>
  );
}
