"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, ListFilter, Plus, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

type DataTableAdditionalType = {
  label?: string;
  dataSize?: string | number;
  addLabelName?: string;
  fallbackText?: string;
  searchField?: string;
  filterField?: string;
  filterValues?: any[];
  openModal?: () => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  label = "Table Name",
  dataSize = 0,
  addLabelName = "Add LabelName",
  fallbackText = "No results",
  searchField = "",
  filterField = "",
  filterValues = [],
  openModal,
}: DataTableProps<TData, TValue> & DataTableAdditionalType) {
  const [pageSize, setPageSize] = useState<number>(5);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const isActiveFilter = useRef<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const handlePageSizeChange = (value: string) => {
    setPageSize(+value);
    table.setPageSize(+value);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-6 justify-between flex-wrap">
        <div className="flex gap-4 items-center">
          <h1 className="text-lg font-semibold">
            {label} ({dataSize})
          </h1>
          {/* {isLoading && <Loader2 className="animate-spin w-5 h-5" />} */}
          {/* {error && <p className="text-rose-600">{error}</p>} */}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {searchField && (
            <div className="relative">
              <Input
                className="max-w-[240px] dark:!bg-zinc-800 pl-7 h-8"
                placeholder={`Search ${searchField}...`}
                value={
                  (table.getColumn(searchField)?.getFilterValue() as string) ||
                  ""
                }
                onChange={(e) => {
                  table.getColumn(searchField)?.setFilterValue(e.target.value);
                }}
              />
              <Search className="w-4 h-4 text-zinc-400 absolute top-[25%] left-1.5" />
            </div>
          )}
          {filterValues.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({
                    size: "sm",
                  }),
                  "cursor-pointer"
                )}
              >
                <ListFilter /> Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by {filterField}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterValues.map((value, index) => {
                  const isActive =
                    table.getColumn(filterField)?.getFilterValue() === value;
                  isActiveFilter.current = isActive;

                  return (
                    <DropdownMenuItem
                      key={index}
                      className="capitalize"
                      onClick={() => {
                        table.getColumn(filterField)?.setFilterValue(value);
                      }}
                    >
                      {value.toLowerCase()}{" "}
                      {isActive && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  );
                })}
                {(table.getColumn(filterField)?.getFilterValue() as
                  | string
                  | null
                  | undefined) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        table.getColumn(filterField)?.setFilterValue(undefined);
                      }}
                    >
                      <X /> Reset
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button size="sm" className="cursor-pointer" onClick={openModal}>
            <Plus /> {addLabelName}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {fallbackText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-fit" size="sm">
              <SelectValue placeholder="Select a page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm font-semibold">{`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}</p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
