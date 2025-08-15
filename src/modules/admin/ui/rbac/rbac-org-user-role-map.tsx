"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import {
  getAllOrganizations,
  getAllRoles,
  getOrgMembers,
  mapRBACUserOrgRole,
} from "../../serveractions/RBAC/server-actions";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAdminModal } from "../../stores/use-admin-modal-store";

type commonStateType = {
  id: string;
  name: string;
};

type selectedOrgUserType = {
  id: string;
  name: string;
  username: string | null;
};

const formSchema = z.object({
  orgId: z.string().min(1, "Organization is required"),
  userId: z.string().min(1, "User is required"),
  roleId: z.string().min(1, "Role is required"),
});

type FormDataType = z.infer<typeof formSchema>;

export function RBACOrgUserRoleMap() {
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const [allOrgs, setAllOrgs] = useState<commonStateType[]>([]);
  const [allRoles, setAllRoles] = useState<commonStateType[]>([]);
  const [selectedOrgUsers, setSelectedOrgUsers] = useState<
    selectedOrgUserType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgId: "",
      userId: "",
      roleId: "",
    },
  });

  const selectedOrgId = form.watch("orgId");

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const allOrgsData = await getAllOrganizations();
        const allROlesData = await getAllRoles();
        setAllOrgs(allOrgsData);
        setAllRoles(allROlesData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Error", {
          description: "Failed to get data!",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedOrgId === "") return;

    (async () => {
      try {
        setIsLoading(true);
        const orgMembers = await getOrgMembers({ orgId: selectedOrgId });
        setSelectedOrgUsers(orgMembers);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Error", {
          description: "Failed to get data!",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedOrgId]);

  const onSubmit = async (values: FormDataType) => {
    try {
      setIsLoading(true);
      await mapRBACUserOrgRole({ ...values });
      toast("User Role mapped Successfully.");
      incrementTriggerRefetch();
      form.reset();
      setSelectedOrgUsers([]);
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="orgId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val)}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {allOrgs.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-12">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Org User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedOrgUsers.length || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select User" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {selectedOrgUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} (@{user.username})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {allRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              "Map"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
