import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableProps {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

export const TableComp = ({ columns, renderRow, data }: TableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(({ header, key, className }) => (
              <TableHead key={key} className={className || undefined}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length > 0 &&
            data?.map((item, index) => renderRow({ ...item, index }))}
        </TableBody>
      </Table>
      {data?.length < 1 && <p className="py-8 text-center">No Data Found</p>}
    </>
  );
};
