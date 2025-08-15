"use client";

import { AppAction, ActionPermission } from "@prisma/client";
import { getAllApps } from "../serveractions/organizations/map-org-to-apps";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
  getAppActions,
  getRoleAppActions,
  getRoleData,
  mapAppActionPermission,
  unmapAppActionPermission,
} from "../serveractions/roles/server-actions";

const formSchema = z.object({
  appId: z.string().min(1, "App ID is required"),
});

type FormDataType = z.infer<typeof formSchema>;

export const ManageRoleAppActionsModal = () => {
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
  const [appActions, setAppActions] = useState<AppAction[]>([]);
  const [roleAppActions, setRoleAppActions] = useState<
    ActionPermission[] | null
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isModalOpen = isOpen && modalType === "manageRoleAppActions";

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appId: "",
    },
  });

  const selectedAppId = form.watch("appId");

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
        const appActions = await getAppActions({ appId: selectedAppId });
        const roleAppMenuItems = await getRoleAppActions({
          appId: selectedAppId,
          roleId,
        });
        setAppActions(appActions || []);
        setRoleAppActions(roleAppMenuItems);
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

  async function handleMapAppMenuItem(
    isAlreadyMapped: boolean,
    appActionId: string
  ) {
    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      setIsLoading(true);
      if (isAlreadyMapped) {
        await unmapAppActionPermission({
          appId: selectedAppId,
          appActionId,
          roleId,
        });
        toast("Action removed successfully.");
      } else {
        await mapAppActionPermission({
          appId: selectedAppId,
          appActionId,
          roleId,
        });
        toast("Action added successfully.");
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
    setAppActions([]);
    setRoleAppActions([]);
    setAllApps([]);
    setRoleData(null);
    setError(null);
    setIsLoading(false);
    closeModal();
    form.reset();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8 sm:max-w-[550px] w-[550px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center flex flex-col">
            <p className="mb-2">Manage Role App Actions</p>
            {roleData?.name}
            <span className="text-base">({roleData?.description})</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {allApps.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogDescription>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">App Actions ({appActions.length})</h3>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && <p className="text-rose-600">{error}</p>}
          </div>
          <div className="rounded-md border max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Description</TableHead>
                  <TableHead className="text-left">Type</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appActions?.map((action) => {
                  const isAlreadyMapped = roleAppActions?.find(
                    (item) => item.appActionId === action.id
                  );

                  return (
                    <TableRow key={action.id}>
                      <TableCell>{action.actionName}</TableCell>
                      <TableCell>{action.description}</TableCell>
                      <TableCell>{action.actionType}</TableCell>
                      <TableCell>
                        <Button
                          variant={isAlreadyMapped ? "destructive" : "default"}
                          size="sm"
                          className="cursor-pointer"
                          disabled={isLoading}
                          onClick={() =>
                            handleMapAppMenuItem(
                              Boolean(isAlreadyMapped),
                              action.id
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
          {appActions.length === 0 && (
            <p className="text-center">No app selected</p>
          )}
        </div>
        <DialogFooter className="space-x-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
