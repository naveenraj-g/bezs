"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Organization, App } from "@prisma/client";
import {
  addAppToOrganization,
  getAllApps,
  getOrganization,
  getOrganizationApps,
  removeAppFromOrganization,
} from "../serveractions/organizations/map-org-to-apps";

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
import {
  authClient,
  useSession,
} from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { addMemberToOrg } from "../serveractions/admin-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const addUserformSchema = z.object({
  appId: z.string().min(2, {
    message: "Must select a app.",
  }),
});

type OrgAppDataType = Organization & {
  appOrganization: {
    app: App;
  }[];
};

type AddUserformSchemaType = z.infer<typeof addUserformSchema>;

export const ManageOrgAppsModal = () => {
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const organizationId = useAdminModal((state) => state.orgId) || "";
  const triggerRefetch = useAdminModal((state) => state.triggerInModal);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementInModalTrigger
  );

  const [allApps, setAllApps] = useState<{ id: string; name: string }[]>([]);
  // const [organization, setOrganization] = useState<Organization | null>();
  const [organizationApps, setOrganizationApps] =
    useState<OrgAppDataType | null>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isModalOpen = isOpen && modalType === "manageOrgApps";

  const form = useForm<AddUserformSchemaType>({
    resolver: zodResolver(addUserformSchema),
    defaultValues: {
      appId: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!organizationId) return;
    (async () => {
      try {
        setIsLoading(true);
        const allAppsData = await getAllApps();
        // const orgData = await getOrganization({ organizationId });
        // setOrganization(orgData);
        setAllApps(allAppsData);
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
  }, [organizationId]);

  useEffect(() => {
    if (!organizationId) return;

    (async () => {
      try {
        setIsLoading(true);
        const orgAppsData = await getOrganizationApps({ organizationId });
        setOrganizationApps(orgAppsData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch datas.");
        toast("Error!", {
          description: "Failed to get Apps data.",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [triggerRefetch, organizationId]);

  const session = useSession();

  if (!session) return;

  async function onSubmitAddApp(values: AddUserformSchemaType) {
    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      setIsLoading(true);
      await addAppToOrganization({ ...values, organizationId });
      toast("App added successfully.");
      form.reset();
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

  async function handleRemoveApp(appId: string) {
    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      setIsLoading(true);
      await removeAppFromOrganization({ appId, organizationId });
      toast("App removed successfully.");
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

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8 sm:max-w-[550px] w-[550px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center flex flex-col">
            {organizationApps?.name}
            <span className="text-base">({organizationApps?.slug})</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitAddApp)}
              className="space-y-8 mb-8"
            >
              <div className="flex flex-col xs:flex-row gap-4 items-center">
                <FormField
                  control={form.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem className="xs:flex-1 w-full">
                      {/* <FormLabel>Username</FormLabel> */}
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="No apps selected" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allApps?.map((app) => (
                            <SelectItem value={app.id} key={app.id}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="cursor-pointer xs:self-start w-full xs:w-fit"
                  disabled={isSubmitting || isLoading}
                >
                  Map App
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">Org Apps ({0})</h3>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && <p className="text-rose-600">{error}</p>}
          </div>
          <div className="rounded-md border max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Slug</TableHead>
                  <TableHead className="text-left">Type</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizationApps?.appOrganization.map((data) => (
                  <TableRow key={data.app.id}>
                    <TableCell>{data.app.name}</TableCell>
                    <TableCell>{data.app.slug}</TableCell>
                    <TableCell>{data.app.type}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                        disabled={isLoading}
                        onClick={() => handleRemoveApp(data.app.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter className="space-x-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
