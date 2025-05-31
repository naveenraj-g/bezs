import { UserFileListTabSwitch } from "@/modules/filenest/ui/user-file-list-tabSwitch";
import ButtonFileUpload from "@/shared/ui/file-upload/button-file-upload";

const FileNestVideosPage = () => {
  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Videos</h1>
        <ButtonFileUpload uploadUiType="click" />
      </div>
      <UserFileListTabSwitch fileType="video" />
    </main>
  );
};

export default FileNestVideosPage;
