import { Prisma } from "../../../../../prisma/generated/filenest";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  File,
  FileText,
  Image,
  X,
  Download,
  MoreHorizontal,
  Expand,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { formatBytes } from "@/utils/helper";

interface FileGridPropsTypes {
  data: Prisma.UserFileGetPayload<object>[] | [];
}

export const GridFileView = ({ data }: FileGridPropsTypes) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/"))
      return <Image className="w-10 h-10 text-primary" />;
    if (fileType === "application/pdf")
      return <FileText className="w-10 h-10 text-red-500" />;
    if (fileType.includes("spreadsheet"))
      return <FileText className="w-10 h-10 text-green-500" />;
    if (fileType.includes("document"))
      return <FileText className="w-10 h-10 text-blue-500" />;
    return <File className="w-10 h-10 text-primary" />;
  };

  return (
    <>
      {data.length == 0 && (
        <p className="text-center mt-12">No files available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 py-2">
        {data.map((file) => (
          <Card
            key={file.id}
            className="hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <CardHeader className="px-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">{getFileIcon(file.fileType)}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {}}
                      className="cursor-pointer"
                    >
                      <Expand className="mr-1 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {}}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {}}
                      className="cursor-pointer"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500 cursor-pointer"
                      onClick={() => {}}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
              <div>
                <p
                  className="font-medium text-sm truncate"
                  title={file.fileName}
                >
                  {file.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.fileSize)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex items-center text-xs text-muted-foreground w-full">
                <span>{format(file.createdAt, "do 'of' MMM, yyyy")}</span>
                <span className="ml-auto bg-secondary px-2 py-1 rounded-md text-xs">
                  {file.filePathType}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
