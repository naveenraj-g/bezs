/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAdminModal } from "../../stores/use-admin-modal-store";
import { format } from "date-fns";
import qs from "query-string";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Ellipsis,
  Loader2,
  Lock,
  PencilLine,
  Plus,
  Search,
  SquareMenu,
  Trash2,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { unmapRBACUserOrgRole } from "../../serveractions/RBAC/server-actions";
import { toast } from "sonner";

type rolesStateType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
type paginationStateType = {
  pageSize: number;
  pageIndex: number;
};

const updateQueryParam = (
  key: string,
  value: any,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>
) => {
  const currentParams = qs.parse(searchParams.toString());

  // If value is an object, nest it properly
  const newParams =
    typeof value === "object" && value !== null
      ? {
          ...currentParams,
          ...Object.entries(value).reduce(
            (acc, [k, v]) => {
              acc[`${k}`] = v;
              return acc;
            },
            {} as Record<string, any>
          ),
        }
      : { ...currentParams, [key]: value };

  const newQuery = qs.stringify(newParams);

  router.push(`?${newQuery}`);
};

const getIsSortedTypeField = (
  sortBy: string | undefined,
  sortDirection: string | undefined,
  sortByIdentifier: string,
  sortDirectionIdentifier: string
): boolean => {
  return (
    sortBy === sortByIdentifier && sortDirection === sortDirectionIdentifier
  );
};

export const RBACListTable = () => {
  const openModal = useAdminModal((state) => state.onOpen);
  const triggerRefetch = useAdminModal((state) => state.trigger);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const totalRoles = searchParams.get("totalRoles") || 0;
  const totalPages = searchParams.get("totalPages") || 0;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortDirection = searchParams.get("sortDirection") || undefined;
  const searchValue = searchParams.get("searchValue") || undefined;
  const filterValue = searchParams.get("filterValue") || undefined;

  const [rbacDatas, setRbacDatas] = useState<rolesStateType[]>([]);
  const [pagination, setPagination] = useState<paginationStateType>({
    pageSize: 5,
    pageIndex: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const res = await axios.post("/api/get-rbac-user-role", {
          limit: pagination.pageSize,
          offset: (pagination.pageIndex - 1) * pagination.pageSize,
          sortBy,
          sortDirection,
          searchField: "name",
          searchOperator: "contains",
          searchValue: searchValue,
        });

        console.log(res.data.rbacData);

        const allRoles = res?.data.rbacData;
        setRbacDatas(allRoles || []);

        // const currentParams = qs.parse(searchParams.toString());
        // const newQs = qs.stringify({
        //   ...currentParams,
        //   totalPages: Math.ceil(res?.data.length / pagination.pageSize),
        //   totalRoles: res?.data.length,
        // });

        // setError(null);

        // router.push(`?${newQs}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch roles.");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    pagination,
    searchParams,
    router,
    sortBy,
    searchValue,
    sortDirection,
    filterValue,
    triggerRefetch,
  ]);

  const handlePrevPage = () => {
    if (pagination.pageIndex > 1) {
      setPagination((prevState) => {
        return {
          ...prevState,
          pageIndex: prevState.pageIndex - 1,
        };
      });
    }
  };

  const handleNextPage = () => {
    if (pagination.pageIndex <= +totalPages) {
      setPagination((prevState) => {
        return {
          ...prevState,
          pageIndex: prevState.pageIndex + 1,
        };
      });
    }
  };

  function handleRowChange(value: string) {
    setPagination((prevState) => {
      return {
        ...prevState,
        pageSize: +value,
      };
    });
  }

  function handleSortColumns(sortBy: string, sortDirection: string) {
    updateQueryParam("sort", { sortBy, sortDirection }, searchParams, router);
  }

  function handleSortColumnsReset() {
    updateQueryParam(
      "sort",
      { sortBy: "", sortDirection: "" },
      searchParams,
      router
    );
  }

  function handleSearchUsers(e: ChangeEvent<HTMLInputElement>) {
    updateQueryParam("searchValue", e.target.value, searchParams, router);
  }

  // function handleFilterValue(value: string) {
  //   updateQueryParam("filterValue", value, searchParams, router);
  // }

  // function handleFilterValueReset() {
  //   updateQueryParam("filterValue", "", searchParams, router);
  // }

  async function unMapUser({
    orgId,
    roleId,
    userId,
  }: {
    orgId: string;
    roleId: string;
    userId: string;
  }) {
    try {
      setIsLoading(true);
      await unmapRBACUserOrgRole({
        orgId,
        roleId,
        userId,
      });
      incrementTriggerRefetch();
      toast("User Role unmapped Successfully.");
    } catch (err) {
      toast((err as Error).message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-6 justify-between flex-wrap">
        <div className="flex gap-4 items-center">
          <h1 className="text-lg font-semibold">All Roles ({totalRoles})</h1>
          {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
          {error && <p className="text-rose-600">{error}</p>}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Input
              className="max-w-[240px] dark:!bg-zinc-800 pl-7 h-8"
              placeholder="Search Roles..."
              onBlur={handleSearchUsers}
            />
            <Search className="w-4 h-4 text-zinc-400 absolute top-[28%] left-1.5" />
          </div>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => openModal({ type: "addRole" })}
          >
            <Plus /> Add Role
          </Button>
        </div>
      </div>

      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    Organization{" "}
                    {sortBy !== "name" && (
                      <ChevronsUpDown className="inline-block h-4 w-4 text-zinc-400" />
                    )}
                    {getIsSortedTypeField(
                      sortBy,
                      sortDirection,
                      "name",
                      "asc"
                    ) && (
                      <ChevronUp className="inline-block h-4 w-4 text-zinc-400" />
                    )}
                    {getIsSortedTypeField(
                      sortBy,
                      sortDirection,
                      "name",
                      "desc"
                    ) && (
                      <ChevronDown className="inline-block h-4 w-4 text-zinc-400" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={10}>
                    <DropdownMenuItem
                      disabled={isLoading}
                      onClick={() => handleSortColumns("name", "asc")}
                    >
                      <ChevronUp /> Asc
                      {getIsSortedTypeField(
                        sortBy,
                        sortDirection,
                        "name",
                        "asc"
                      ) && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isLoading}
                      onClick={() => handleSortColumns("name", "desc")}
                    >
                      <ChevronDown /> Desc
                      {getIsSortedTypeField(
                        sortBy,
                        sortDirection,
                        "name",
                        "desc"
                      ) && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                    {sortBy === "name" && (
                      <DropdownMenuItem
                        onClick={handleSortColumnsReset}
                        disabled={isLoading}
                      >
                        <X /> Reset
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    Created At{" "}
                    {sortBy !== "createdAt" && (
                      <ChevronsUpDown className="inline-block h-4 w-4 text-zinc-400" />
                    )}
                    {getIsSortedTypeField(
                      sortBy,
                      sortDirection,
                      "createdAt",
                      "asc"
                    ) && (
                      <ChevronUp className="inline-block h-4 w-4 text-zinc-400" />
                    )}
                    {getIsSortedTypeField(
                      sortBy,
                      sortDirection,
                      "createdAt",
                      "desc"
                    ) && (
                      <ChevronDown className="inline-block h-4 w-4 text-zinc-400" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={10}>
                    <DropdownMenuItem
                      onClick={() => handleSortColumns("createdAt", "asc")}
                      disabled={isLoading}
                    >
                      <ChevronUp /> Asc
                      {getIsSortedTypeField(
                        sortBy,
                        sortDirection,
                        "createdAt",
                        "asc"
                      ) && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortColumns("createdAt", "desc")}
                      disabled={isLoading}
                    >
                      <ChevronDown /> Desc
                      {getIsSortedTypeField(
                        sortBy,
                        sortDirection,
                        "createdAt",
                        "desc"
                      ) && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                    {sortBy === "createdAt" && (
                      <DropdownMenuItem
                        onClick={handleSortColumnsReset}
                        disabled={isLoading}
                      >
                        <X /> Reset
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rbacDatas.map((data) => (
              <TableRow key={data?.id}>
                <TableCell className="max-w-[80px] truncate">
                  {data?.organization.name}
                </TableCell>
                <TableCell className="max-w-[80px] truncate">
                  {data?.user.name} (@{data?.user.username})
                </TableCell>
                <TableCell>{data?.role.name}</TableCell>
                <TableCell>
                  {format(data?.createdAt, "do 'of' MMM, yyyy")}
                </TableCell>
                <TableCell>
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      unMapUser({
                        orgId: data?.organization.id,
                        roleId: data?.role.id,
                        userId: data?.user.id,
                      })
                    }
                  >
                    UnMap
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {rbacDatas.length === 0 && (
        <p className="text-center mb-12 mt-6 flex justify-center items-center gap-2">
          <TriangleAlert className="text-rose-600 w-5 h-5" />
          No RBAC datas found.
        </p>
      )}

      <div className="flex gap-6 items-center justify-end">
        <div className="flex items-center gap-2">
          <p className="text-sm">Rows per page</p>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={handleRowChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[65px]">
              <SelectValue />
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
        <p className="text-sm font-semibold">{`Page ${pagination.pageIndex} of ${+totalPages}`}</p>
        <div className="space-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer border"
            disabled={
              pagination.pageIndex === 1 || isLoading || rbacDatas.length === 0
            }
            onClick={handlePrevPage}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer border"
            disabled={
              pagination.pageIndex === +totalPages ||
              isLoading ||
              rbacDatas.length === 0
            }
            onClick={handleNextPage}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
