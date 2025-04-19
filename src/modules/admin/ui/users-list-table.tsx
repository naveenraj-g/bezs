/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { ChangeEvent, useEffect, useState } from "react";
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
  DropdownMenuLabel,
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
  ListFilter,
  Loader2,
  PencilLine,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAdminModal } from "../stores/use-admin-modal-store";

type usersStateType = typeof authClient.$Infer.Session.user;
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

const UsersListTable = () => {
  const openModal = useAdminModal((state) => state.onOpen);
  const triggerRefetch = useAdminModal((state) => state.trigger);

  const searchParams = useSearchParams();
  const router = useRouter();

  const totalUsers = searchParams.get("totalUsers") || 0;
  const totalPages = searchParams.get("totalPages") || 0;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortDirection = searchParams.get("sortDirection") || undefined;
  const searchValue = searchParams.get("searchValue") || undefined;
  const filterValue = searchParams.get("filterValue") || undefined;

  const [users, setUsers] = useState<usersStateType[]>([]);
  const [pagination, setPagination] = useState<paginationStateType>({
    pageSize: 5,
    pageIndex: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const allUsers = await authClient.admin.listUsers({
          query: {
            limit: pagination.pageSize,
            offset: (pagination.pageIndex - 1) * pagination.pageSize,
            sortBy: sortBy,
            sortDirection: sortDirection,
            searchField: "name",
            searchOperator: "contains",
            searchValue: searchValue,
            filterField: "role",
            filterOperator: "eq",
            filterValue: filterValue,
          },
        });

        setUsers(allUsers.data?.users);

        const currentParams = qs.parse(searchParams.toString());
        const newQs = qs.stringify({
          ...currentParams,
          totalPages: Math.ceil(allUsers.data?.total / pagination.pageSize),
          totalUsers: allUsers.data?.total,
        });

        router.push(`?${newQs}`);
      } catch (error) {
        setError("Failed to fetch users.");
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

  function handleFilterValue(value: string) {
    updateQueryParam("filterValue", value, searchParams, router);
  }

  function handleFilterValueReset() {
    updateQueryParam("filterValue", "", searchParams, router);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-6 justify-between flex-wrap">
          <div className="flex gap-4 items-center">
            <h1 className="text-lg font-semibold">All Users ({totalUsers})</h1>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && <p>{error}</p>}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Input
                className="max-w-[240px] dark:!bg-zinc-800 pl-7 h-8"
                placeholder="Search names..."
                onBlur={handleSearchUsers}
              />
              <Search className="w-4 h-4 text-zinc-400 absolute top-[28%] left-1.5" />
            </div>
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
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleFilterValue("admin")}
                  disabled={isLoading}
                >
                  Admin
                  {filterValue === "admin" && <Check className="ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterValue("user")}
                  disabled={isLoading}
                >
                  User
                  {filterValue === "user" && <Check className="ml-auto" />}
                </DropdownMenuItem>
                {filterValue && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleFilterValueReset}>
                      <X /> Reset
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={() => openModal("addUser", "")}
            >
              <Plus /> Add user
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
                      Name{" "}
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
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      Email{" "}
                      {sortBy !== "email" && (
                        <ChevronsUpDown className="inline-block h-4 w-4 text-zinc-400" />
                      )}
                      {getIsSortedTypeField(
                        sortBy,
                        sortDirection,
                        "email",
                        "asc"
                      ) && (
                        <ChevronUp className="inline-block h-4 w-4 text-zinc-400" />
                      )}
                      {getIsSortedTypeField(
                        sortBy,
                        sortDirection,
                        "email",
                        "desc"
                      ) && (
                        <ChevronDown className="inline-block h-4 w-4 text-zinc-400" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={10}>
                      <DropdownMenuItem
                        onClick={() => handleSortColumns("email", "asc")}
                        disabled={isLoading}
                      >
                        <ChevronUp /> Asc
                        {getIsSortedTypeField(
                          sortBy,
                          sortDirection,
                          "email",
                          "asc"
                        ) && <Check className="ml-auto" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortColumns("email", "desc")}
                        disabled={isLoading}
                      >
                        <ChevronDown /> Desc
                        {getIsSortedTypeField(
                          sortBy,
                          sortDirection,
                          "email",
                          "desc"
                        ) && <Check className="ml-auto" />}
                      </DropdownMenuItem>
                      {sortBy === "email" && (
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
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>2FA Enabled</TableHead>
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      Joined{" "}
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
              {users.map((user) => (
                <TableRow key={user?.id}>
                  <TableCell>
                    <p className="max-w-[150px] truncate">{user?.name}</p>
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.role}</TableCell>
                  <TableCell>{user?.emailVerified ? "Yes" : "No"}</TableCell>
                  <TableCell>{user?.twoFactorEnabled ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex items-center justify-between gap-4">
                    {format(user?.createdAt, "do 'of' MMM, yyyy")}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer">
                        <Ellipsis className="font-medium" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="left">
                        <DropdownMenuItem className="cursor-pointer">
                          <User />
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openModal("editUser", user.id)}
                        >
                          <PencilLine />
                          Edit details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="space-x-2 cursor-pointer"
                          onClick={() => openModal("deleteUser", user.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 />
                            Delete user
                          </div>
                          <TriangleAlert className="text-rose-600" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
              disabled={pagination.pageIndex === 1 || isLoading}
              onClick={handlePrevPage}
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="cursor-pointer border"
              disabled={pagination.pageIndex === +totalPages || isLoading}
              onClick={handleNextPage}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersListTable;
