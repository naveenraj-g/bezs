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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Session } from "@/modules/auth/types/auth-types";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { capitalizeString } from "@/utils/helper";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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

type accountsType = {
  id: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  scopes: string[];
}[];

const ManageAccount = ({
  session,
  accounts,
}: {
  session: Session;
  accounts: accountsType;
}) => {
  const router = useRouter();
  const { user } = session;

  const [socialAccountDeletion, setSocialAccountDeletion] =
    useState<boolean>(false);

  const hasCredentialAccount = accounts.find(
    (acc) => acc.provider === "credential"
  );

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
    <div className="mt-8 flex flex-col gap-10">
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
                      <Input placeholder="your name" {...field} />
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

      <ListUserAccounts accounts={accounts} session={session} />

      <Card className="p-4">
        <div>
          <h1 className="text-lg">Delete Account</h1>
          <p className="text-zinc-500 dark:text-zinc-300/90">
            Once you deleted this account, there is no way to recover it.
          </p>
        </div>
        <div>
          {hasCredentialAccount ? (
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
          ) : (
            <Button
              type="submit"
              variant="destructive"
              className="cursor-pointer"
              disabled={isDeleteUserSubmitting}
              onClick={async () => {
                setSocialAccountDeletion(true);
                await authClient.deleteUser(
                  {
                    callbackURL: "/goodbye",
                  },
                  {
                    onSuccess() {
                      setSocialAccountDeletion(false);
                      toast("Delete Confirmation email has been send.", {
                        description: "Check your email.",
                      });
                    },
                    onError(ctx) {
                      setSocialAccountDeletion(false);
                      toast("An error occurred!", {
                        description: ctx.error.message,
                      });
                    },
                  }
                );
                setSocialAccountDeletion(false);
              }}
            >
              {socialAccountDeletion ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageAccount;

function ListUserAccounts({
  accounts,
  session,
}: {
  accounts: accountsType;
  session: Session;
}) {
  const router = useRouter();
  const [socialUnlinkLoading, setSocialUnlinkLoading] =
    useState<boolean>(false);

  const socialsAccounts = accounts.filter(
    (account) => account.provider !== "credential"
  );
  const credentialAccounts = accounts.filter(
    (account) => account.provider === "credential"
  );

  const hasGoogleAccount = socialsAccounts.some(
    (account) => account.provider === "google"
  );
  const hasGithubAccount = socialsAccounts.some(
    (account) => account.provider === "github"
  );

  async function handleLinkSocialAccount(provider: "google" | "github") {
    await authClient.linkSocial({
      provider,
      callbackURL: "/bezs",
    });
  }

  async function handleUnlinkSocialAccount(provider: string) {
    setSocialUnlinkLoading(true);
    await authClient.unlinkAccount(
      {
        providerId: provider,
      },
      {
        onSuccess() {
          setSocialUnlinkLoading(false);
          toast("Unlink Success!");
          router.refresh();
        },
        onError(ctx) {
          setSocialUnlinkLoading(false);
          toast("An error occurred!", {
            description: ctx.error.message,
          });
        },
      }
    );
    setSocialUnlinkLoading(false);
  }

  return (
    <Card className="p-4">
      <div>
        <h1 className="text-lg">Connected Accounts</h1>
        <p className="text-zinc-500 dark:text-zinc-300/90">
          You can connect multiple accounts to your profile.
        </p>
      </div>
      <div className="space-y-12">
        <div>
          <h2>Socials</h2>
          <div className="w-[450px] mt-2">
            {socialsAccounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-right">
                      Account Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialsAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        {capitalizeString(account.provider)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer px-2 py-1 h-fit w-[57px]"
                          disabled={socialUnlinkLoading}
                          onClick={() =>
                            handleUnlinkSocialAccount(account.provider)
                          }
                        >
                          {socialUnlinkLoading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Unlink"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Account doesn&apos;t have any social login.</p>
            )}
          </div>
        </div>

        <div>
          <h2>Credentials</h2>
          <div className="w-[450px] mt-2">
            {credentialAccounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentialAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{session.user.email}</TableCell>
                      <TableCell className="text-right">
                        {session.user.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Account doesn&apos;t have credential login.</p>
            )}
          </div>
        </div>

        {hasGithubAccount && hasGoogleAccount ? null : (
          <div>
            <h2 className="text-lg">Link Socials</h2>
            <div className="flex gap-4 items-center mt-3">
              {!hasGoogleAccount && (
                <RiGoogleFill
                  size={30}
                  // color="#4285F4"
                  aria-hidden="true"
                  className="cursor-pointer"
                  onClick={() => handleLinkSocialAccount("google")}
                />
              )}
              {!hasGithubAccount && (
                <RiGithubFill
                  size={30}
                  aria-hidden="true"
                  className="cursor-pointer"
                  onClick={() => handleLinkSocialAccount("github")}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
