"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Session } from "@/modules/auth/types/auth-types";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";

const UpdateInfoFormSchema = z.object({
  image: z.string().url().optional(),
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(20, "Name must have at most 20 characters"),
});
const DeleteUserFormSchema = z.object({
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

type UpdateInfoForm = z.infer<typeof UpdateInfoFormSchema>;
type DeleteUserForm = z.infer<typeof DeleteUserFormSchema>;

const ManageAccount = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { user } = session;

  const userInfoForm = useForm<UpdateInfoForm>({
    resolver: zodResolver(UpdateInfoFormSchema),
    defaultValues: {
      image: user?.image || "",
      name: user?.name || "",
    },
  });
  const deleteAccountForm = useForm<DeleteUserForm>({
    resolver: zodResolver(DeleteUserFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = userInfoForm;

  const {
    formState: { isSubmitting: isDeleteUserSubmitting },
  } = deleteAccountForm;

  async function userInfoFormSubmit(values: UpdateInfoForm) {
    if (!user) {
      return toast("Unauthorized!");
    }

    const { image, name } = values;

    await authClient.updateUser(
      {
        image,
        name,
      },
      {
        onSuccess() {
          router.refresh();
          toast("Update Success!");
        },
        onError(ctx) {
          toast("An error occurred!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  async function handleDeleteAccount(values: DeleteUserForm) {
    const { password } = values;

    await authClient.deleteUser(
      {
        password: password,
        callbackURL: "/goodbye",
      },
      {
        onSuccess() {
          toast("Delete Confirmation email has been send.", {
            description: "Check your email.",
          });
          deleteAccountForm.reset();
        },
        onError(ctx) {
          toast("An error occurred!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  return (
    <div className="mt-10 flex flex-col gap-10">
      <Card className="p-4">
        <Form {...userInfoForm}>
          <form
            onSubmit={userInfoForm.handleSubmit(userInfoFormSubmit)}
            className="space-y-8"
          >
            <div className="flex gap-14">
              <FormField
                control={userInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Naveen Raj" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={userInfoForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Profile Url</FormLabel>
                    <FormControl>
                      <Input placeholder="http://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-4">
        <div>
          <h1 className="text-lg">Delete Account</h1>
          <p className="text-zinc-500 dark:text-zinc-300/90">
            Once you deleted this account, there is no way to recover it.
          </p>
        </div>
        <div>
          <Form {...deleteAccountForm}>
            <form
              onSubmit={deleteAccountForm.handleSubmit(handleDeleteAccount)}
              className="space-y-8"
            >
              <FormField
                control={deleteAccountForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Passowrd</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
                disabled={isDeleteUserSubmitting}
              >
                {isDeleteUserSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ManageAccount;
