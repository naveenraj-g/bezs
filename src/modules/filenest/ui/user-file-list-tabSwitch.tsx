"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableFileView } from "@/shared/ui/file-views/table-file-view/table-file-view";
import { GridFileView } from "@/shared/ui/file-views/grid-file-view/grid-file-view";
import { Grid3x3, Loader2, Rows2, Rows3 } from "lucide-react";
import { Prisma } from "../../../../prisma/generated/filenest";
import { useServerAction } from "zsa-react";
import { usePathname } from "next/navigation";
import { getAllUserFileData } from "@/modules/filenest/serveractions/app-server-action/getall-userFile-server-action";
import { useEffect, useState } from "react";
import { useFileNestUserModal } from "../stores/use-filenest-user-modal-store";

type PropsDataType = {
  fileType?: "documents" | "images" | "videos" | "audios" | "others";
};

export const UserFileListTabSwitch = ({ fileType }: PropsDataType) => {
  const pathname = usePathname();

  const [userFilesData, setUserFilesData] = useState<
    Prisma.UserFileGetPayload<object>[]
  >([]);

  const triggerRefetch = useFileNestUserModal((state) => state.trigger);

  const { execute, isPending, reset, isError, error } =
    useServerAction(getAllUserFileData);

  useEffect(() => {
    (async () => {
      const [data] = await execute({
        pathname: pathname || "",
        fileType,
      });
      setUserFilesData(data?.userFilesData || []);
    })();
  }, [pathname, fileType, execute, triggerRefetch]);

  return (
    <>
      <Tabs defaultValue="grid">
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="grid" className="cursor-pointer">
              <Grid3x3 />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="cursor-pointer">
              <Rows3 />
              Table
            </TabsTrigger>
          </TabsList>
          <div>
            {isPending && <Loader2 className="animate-spin w-6 h-6" />}
            {isError && <p className="text-rose-600">{error.message}</p>}
          </div>
        </div>
        <TabsContent value="grid">
          <GridFileView data={userFilesData} />
        </TabsContent>
        <TabsContent value="table">
          <TableFileView data={userFilesData} />
        </TabsContent>
      </Tabs>
    </>
  );
};
