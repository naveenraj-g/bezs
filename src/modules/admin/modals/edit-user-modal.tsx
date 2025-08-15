/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminModal } from "../stores/use-admin-modal-store";
import {
  authClient,
  useSession,
} from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const createUserFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  email: z.string().email(),
  role: z.string({ required_error: "Please select a Role for user." }),
  banned: z.boolean().nullable().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.date().nullable().optional(),
});

type CreateUserFormSchemaType = z.infer<typeof createUserFormSchema>;

type userDetails = {
  id: string;
  name: string;
  image: string;
  role: string;
  email: string;
  emailVerified: boolean | null;
  twoFactorEnabled: boolean | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
};

export const EditUserModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const userId = useAdminModal((state) => state.userId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const roles = ["guest", "admin"];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<userDetails>({
    id: "",
    name: "",
    image: "",
    role: "",
    email: "",
    emailVerified: null,
    twoFactorEnabled: null,
    banned: null,
    banReason: null,
    banExpires: null,
  });

  const isModalOpen = isOpen && modalType === "editUser";

  const form = useForm<CreateUserFormSchemaType>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      banned: null,
      banReason: null,
      banExpires: null,
    },
  });

  useEffect(() => {
    if (!userId || !isModalOpen) return;

    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.post("/api/get-user", {
          userId,
        });

        setUserDetails(data?.user);
        form.reset({
          name: data?.user.name,
          email: data?.user.email,
          role: data?.user.role,
          banned: data?.user.banned,
          banReason: data?.user.banReason,
          banExpires: data?.user.banExpires,
        });
        setIsLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Error", {
          description: "Failed to fetch user data.",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isModalOpen, userId, form]);

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateUser(values: CreateUserFormSchemaType) {
    const { name, email, role } = values;

    const userDetails = {
      id: userId,
      name,
      email,
      role,
    };

    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      const { data } = await axios.post("/api/edit-user", userDetails);

      if (data?.success) {
        authClient.admin.revokeUserSessions({
          userId: userId,
        });
      }
      toast("Success", {
        description: data?.success,
      });
      closeModal();
      incrementTriggerRefetch();
    } catch (err) {
      toast("Error!", {
        description:
          (err as any).response?.data?.error || "An unexpected error occurred.",
      });
    }
  }

  function handleCloseModal() {
    setUserDetails({
      id: "",
      name: "",
      image: "",
      role: "",
      email: "",
      emailVerified: null,
      twoFactorEnabled: null,
      banned: null,
      banReason: null,
      banExpires: null,
    });
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8 ">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl text-center">
            Edit User
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateUser)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  // defaultValue={form.getValues("email")}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role, i) => (
                            <SelectItem
                              value={role}
                              key={i}
                              className="flex items-center"
                              disabled={isLoading}
                            >
                              {role}
                              {role === userDetails?.role && (
                                <CircleCheckBig className="!w-[14px] !h-[14px] text-green-500" />
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-x-4">
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? (
                      <>
                        Update <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </div>
          <DialogFooter className="space-x-2"></DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
