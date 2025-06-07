import { userFileViewColumn } from "@/modules/filenest/ui/tableColumn/user-file-view-column";
import { Prisma } from "../../../../../prisma/generated/filenest";
import DataTable from "../../table/data-table";

export const TableFileView = ({
  data,
}: {
  data: Prisma.UserFileGetPayload<object>[] | [];
}) => {
  return (
    <>
      <DataTable
        columns={userFileViewColumn}
        data={data}
        isAddButton={false}
        isBorder={false}
        fallbackText="No files available."
      />
    </>
  );
};
