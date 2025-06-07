import { FileNestAdminModalProvider } from "@/modules/filenest/providers/FileNestAdminModalProvider";
import React from "react";

const FileNestAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <FileNestAdminModalProvider />
      {children}
    </>
  );
};

export default FileNestAdmin;
