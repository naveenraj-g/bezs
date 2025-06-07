import { FileNestUserModalProvider } from "@/modules/filenest/providers/FileNestUserModalProvider";

const FileNestFileTypeDynamicLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <FileNestUserModalProvider />
      {children}
    </>
  );
};

export default FileNestFileTypeDynamicLayout;
