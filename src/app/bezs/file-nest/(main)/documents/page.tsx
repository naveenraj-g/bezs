import { UserFileListTabSwitch } from "@/modules/filenest/ui/user-file-list-tabSwitch";
import ButtonFileUpload from "@/shared/ui/file-upload/button-file-upload";
import { headers } from "next/headers";

const FileNestDocumentsPage = async () => {
  const headersList = headers();
  const fullUrl = (await headersList).get("next-url");
  console.log({ fullUrl });

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <ButtonFileUpload uploadUiType="click" />
      </div>
      <UserFileListTabSwitch fileType="document" />
    </main>
  );
};

export default FileNestDocumentsPage;
