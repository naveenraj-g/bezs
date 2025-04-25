"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { OrganizationType } from "@/modules/auth/types/auth-types";
import { MemberType } from "@/modules/auth/types/auth-types";
import { Input } from "@/components/ui/input";
import { addMemberToOrg } from "../serveractions/auth-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

type Organization = OrganizationType & {
  members: Array<
    MemberType & {
      user: {
        email: string;
        id: string;
        image: string | null;
        name: string;
      };
    }
  >;
};

const addUserformSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type AddUserformSchemaType = z.infer<typeof addUserformSchema>;

export const ManageOrgModal = () => {
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const organizationId = useAdminModal((state) => state.orgId) || "";
  const triggerRefetch = useAdminModal((state) => state.trigger);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const [organization, setOrganization] = useState<
    Organization | null | undefined
  >();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AddUserformSchemaType>({
    resolver: zodResolver(addUserformSchema),
    defaultValues: {
      userName: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const orgData = await authClient.organization.getFullOrganization(
        {
          query: { organizationId: organizationId },
        },
        {
          onSuccess() {
            setError(null);
          },
          onError(ctx) {
            toast("Error!", {
              description: ctx.error.message,
            });
            setError(ctx.error.message);
            setIsLoading(false);
          },
        }
      );
      setOrganization(orgData?.data);
      setIsLoading(false);
    })();
  }, [triggerRefetch, organizationId]);

  const session = useSession();

  if (!session) return;

  const isModalOpen = isOpen && modalType === "manageOrgMembers";

  async function onSubmitAddUser(values: AddUserformSchemaType) {
    const args = {
      userName: values.userName,
      organizationId: organizationId,
      session: session,
    };

    try {
      await addMemberToOrg({ role: "member", ...args });
      toast("User added to org successfully");
      form.reset();
    } catch (err) {
      toast("Error!", {
        description: (err as Error).message,
      });
    }

    incrementTriggerRefetch();
  }

  async function handleRemoveUser(memberId: string, orgId: string) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    await authClient.organization.removeMember(
      {
        memberIdOrEmail: memberId,
        organizationId: orgId,
      },
      {
        onSuccess() {
          toast("user removed");
          incrementTriggerRefetch();
        },
        onError(ctx) {
          toast("Error!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8 sm:max-w-[550px] w-[550px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl text-center flex flex-col">
            {organization?.name}
            <span className="text-base">({organization?.slug})</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitAddUser)}
              className="space-y-8 mb-8"
            >
              <div className="flex flex-col xs:flex-row gap-4 items-center">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem className="xs:flex-1 w-full">
                      {/* <FormLabel>Username</FormLabel> */}
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="cursor-pointer xs:self-start w-full xs:w-fit"
                  disabled={isSubmitting}
                >
                  Map User
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
        <div className="space-y-4 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-semibold">
              Org Members ({organization?.members.length})
            </h3>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {error && <p className="text-rose-600">{error}</p>}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Email</TableHead>
                  <TableHead className="text-left">Role</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organization?.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.user.name}</TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                        disabled={member.role === "owner"}
                        onClick={() =>
                          handleRemoveUser(member.id, organizationId)
                        }
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
