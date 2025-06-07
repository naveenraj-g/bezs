import { prismaFileNest } from "@/lib/prisma";
import { UserFileListTabSwitch } from "@/modules/filenest/ui/user-file-list-tabSwitch";
import ButtonFileUpload from "@/shared/ui/file-upload/button-file-upload";
import { headers } from "next/headers";

const FileNestFileTypeDynamicPage = async ({
  params,
}: {
  params: { fileType: string };
}) => {
  const { fileType } = await params;

  const headersList = headers();
  const fullUrl = (await headersList).get("x-url") || "";
  const pathname = fullUrl ? new URL(fullUrl).pathname : "";
  const formattedPathSlug = pathname.split("/").slice(0, 3).join("/");

  const uploadStorageType = await prismaFileNest.appStorageSetting.findFirst({
    where: {
      appSlug: formattedPathSlug,
    },
    select: {
      type: true,
    },
  });

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold capitalize">
          {fileType.toLowerCase()}
        </h1>
        <ButtonFileUpload
          uploadUiType="click"
          uploadStorageType={uploadStorageType?.type}
        />
      </div>
      <UserFileListTabSwitch
        fileType={
          ["documents", "images", "videos", "audios", "others"].includes(
            fileType
          )
            ? (fileType as
                | "documents"
                | "images"
                | "videos"
                | "audios"
                | "others")
            : undefined
        }
      />
    </main>
  );
};

export default FileNestFileTypeDynamicPage;
