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
import { Loader2 } from "lucide-react";

const createUserFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
  role: z.string({ required_error: "Please select a Role for user." }),
});

type CreateUserFormSchemaType = z.infer<typeof createUserFormSchema>;

export const CreateUserModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const roles = ["user", "admin"];

  const isModalOpen = isOpen && modalType === "addUser";

  const form = useForm<CreateUserFormSchemaType>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: roles[0],
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateUser(values: CreateUserFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    const { email, name, password, role } = values;

    await authClient.admin.createUser(
      {
        name,
        email,
        password,
        role,
      },
      {
        onSuccess() {
          toast("User Created.");
        },
        onError(ctx) {
          toast("Error", {
            description: ctx.error.message,
          });
        },
      }
    );

    incrementTriggerRefetch();
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8 ">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl text-center">
            Create User
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
                        <Input placeholder="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="*****" {...field} />
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role, i) => (
                            <SelectItem value={role} key={i}>
                              {role}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Submit <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      "Submit"
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
