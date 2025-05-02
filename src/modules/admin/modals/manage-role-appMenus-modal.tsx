"use client";

import { AppMenuItem, MenuPermission } from "@prisma/client";
import { getAllApps } from "../serveractions/organizations/map-org-to-apps";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminModal } from "../stores/use-admin-modal-store";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  getAppMenuItems,
  getRoleAppMenuItems,
  getRoleData,
  mapAppMenuPermission,
  unmapAppMenuPermission,
} from "../serveractions/roles/server-actions";

export const ManageRoleAppMenusModal = () => {
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const roleId = useAdminModal((state) => state.roleId) || "";
  const triggerRefetch = useAdminModal((state) => state.triggerInModal);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementInModalTrigger
  );

  const [roleData, setRoleData] = useState<{
    name: string;
    id: string;
    description: string;
  } | null>();
  const [allApps, setAllApps] = useState<{ id: string; name: string }[]>([]);
  const [appMenuItems, setAppMenuItems] = useState<AppMenuItem[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [roleAppMenuItems, setRoleAppMenuItems] = useState<
    MenuPermission[] | null
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isModalOpen = isOpen && modalType === "manageRoleAppMenus";

  useEffect(() => {
    if (!roleId || !isModalOpen) return;

    (async () => {
      try {
        setIsLoading(true);
        const roleData = await getRoleData({ roleId });
        const allAppsData = await getAllApps();
        setAllApps(allAppsData);
        setRoleData(roleData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Error!", {
          description: "Failed to get Apps data.",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isModalOpen, roleId]);

  useEffect(() => {
    if (!selectedAppId || !isModalOpen) return;

    (async () => {
      try {
        setIsLoading(true);
        const appMenuItems = await getAppMenuItems({ appId: selectedAppId });
        const roleAppMenuItems = await getRoleAppMenuItems({
          appId: selectedAppId,
          roleId,
        });
        setAppMenuItems(appMenuItems || []);
        setRoleAppMenuItems(roleAppMenuItems);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Error!", {
          description: "Failed to get datas.",
        });
        setError("Failed to get data!");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch, selectedAppId, isModalOpen, roleId]);

  const session = useSession();

  if (!session) return;

  function handleAppSelectChange(value: string) {
    setSelectedAppId(value);
  }

  async function handleMapAppMenuItem(
    isAlreadyMapped: boolean,
    appMenuItemId: string
  ) {
    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      setIsLoading(true);
      if (isAlreadyMapped) {
        await unmapAppMenuPermission({
          appId: selectedAppId,
          appMenuItemId,
          roleId,
        });
        toast("MenuItem removed successfully.");
      } else {
        await mapAppMenuPermission({
          appId: selectedAppId,
          appMenuItemId,
          roleId,
        });
        toast("MenuItem added successfully.");
      }
      incrementTriggerRefetch();
    } catch (err) {
      toast("Error!", {
        description: (err as Error).message,
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCloseModal() {
    setSelectedAppId("");
    setAppMenuItems([]);
    setRoleAppMenuItems([]);
    setAllApps([]);
    setRoleData(null);
    setError(null);
    setIsLoading(false);
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8 sm:max-w-[550px] w-[550px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center flex flex-col">
            <p className="mb-2">Manage Role App MenuItems</p>
            {roleData?.name}
            <span className="text-base">({roleData?.description})</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div>
            <Select onValueChange={handleAppSelectChange}>
              <SelectTrigger
                className="w-full text-zinc-900"
                disabled={isLoading}
              >
                <SelectValue placeholder="No apps selected" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allApps?.map((app) => (
                    <SelectItem value={app.id} key={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DialogDescription>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">
              App MenuItems ({appMenuItems.length})
            </h3>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && <p className="text-rose-600">{error}</p>}
          </div>
          <div className="rounded-md border max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Description</TableHead>
                  <TableHead className="text-left">Slug</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appMenuItems?.map((menuItem) => {
                  const isAlreadyMapped = roleAppMenuItems?.find(
                    (item) => item.appMenuItemId === menuItem.id
                  );

                  return (
                    <TableRow key={menuItem.id}>
                      <TableCell>{menuItem.name}</TableCell>
                      <TableCell>{menuItem.description}</TableCell>
                      <TableCell>{menuItem.slug}</TableCell>
                      <TableCell>
                        <Button
                          variant={isAlreadyMapped ? "destructive" : "default"}
                          size="sm"
                          className="cursor-pointer"
                          disabled={isLoading}
                          onClick={() =>
                            handleMapAppMenuItem(
                              Boolean(isAlreadyMapped),
                              menuItem.id
                            )
                          }
                        >
                          {isAlreadyMapped ? "UnMap" : "Map"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {appMenuItems.length === 0 && (
            <p className="text-center">No app selected</p>
          )}
        </div>
        <DialogFooter className="space-x-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
