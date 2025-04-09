"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Session } from "@/modules/auth/types/auth-types";
import { toast } from "sonner";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { Switch } from "@/components/ui/switch";

const emailChangeFormSchema = z.object({
  newEmail: z.string().email(),
  callbackURL: z.string().default("/bezs"),
});
const passwordChangeFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
  currentPassword: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
});
const twoFaSchema = z.object({
  state: z.boolean(),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
});

type EmailChangeForm = z.infer<typeof emailChangeFormSchema>;
type PasswordChangeForm = z.infer<typeof passwordChangeFormSchema>;
type TwoFaForm = z.infer<typeof twoFaSchema>;

const AccountSecurityPage = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { user } = session;

  const emailChangeForm = useForm<EmailChangeForm>({
    resolver: zodResolver(emailChangeFormSchema),
    defaultValues: {
      newEmail: "",
      callbackURL: "/bezs",
    },
  });

  const passwordChangeForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeFormSchema),
    defaultValues: {
      newPassword: "",
      currentPassword: "",
    },
  });

  const twoFaForm = useForm<TwoFaForm>({
    resolver: zodResolver(twoFaSchema),
    defaultValues: {
      state: session?.user.twoFactorEnabled || false,
      password: "",
    },
  });

  const {
    formState: { isSubmitting: emailIsSubmitting },
  } = emailChangeForm;

  const {
    formState: { isSubmitting: passwordIsSubmitting },
  } = passwordChangeForm;

  const {
    formState: { isSubmitting: twoFaIsSubmitting },
  } = twoFaForm;

  async function onEmailChange(values: EmailChangeForm) {
    if (!user) {
      return toast("Unauthorized!");
    }

    const { newEmail, callbackURL } = values;

    await authClient.changeEmail(
      {
        newEmail,
        callbackURL,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast("Success", {
            description: "Confirmation email sent to old Email.",
          });
          emailChangeForm.reset();
        },
        onError: (ctx) => {
          toast("An error occurred!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  async function onPasswordChange(values: PasswordChangeForm) {
    if (!user) {
      return toast("Unauthorized!");
    }

    const { currentPassword, newPassword } = values;

    await authClient.changePassword(
      {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast("Password Updated Successfull!");
          passwordChangeForm.reset();
        },
        onError: (ctx) => {
          toast("An error occurred!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  async function onTwoFaChange(values: TwoFaForm) {
    if (!user) {
      return toast("Unauthorized!");
    }

    const { password, state } = values;

    if (state) {
      await authClient.twoFactor.enable(
        {
          password,
        },
        {
          onSuccess() {
            toast("2FA enabled successfully!");
          },
          onError(ctx) {
            toast("An error occurred!", {
              description: (
                <span className="dark:text-zinc-400">{ctx.error.message}</span>
              ),
            });
          },
        }
      );
    }

    if (!state) {
      await authClient.twoFactor.disable(
        {
          password,
        },
        {
          onSuccess() {
            toast("2FA Disabled successfully!");
          },
          onError(ctx) {
            toast("An error occurred!", {
              description: (
                <span className="dark:text-zinc-400">{ctx.error.message}</span>
              ),
            });
          },
        }
      );
    }
  }

  return (
    <>
      <div className="mt-10 flex flex-col gap-10">
        <Card className="p-4">
          <Form {...emailChangeForm}>
            <h1>Change Email</h1>
            <form
              onSubmit={emailChangeForm.handleSubmit(onEmailChange)}
              className="space-y-8"
            >
              <FormField
                control={emailChangeForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={emailIsSubmitting}
              >
                {emailIsSubmitting ? "Changing..." : "Change"}
              </Button>
            </form>
          </Form>
        </Card>

        <Card className="p-4">
          <Form {...passwordChangeForm}>
            <h1>Update Password</h1>
            <form
              onSubmit={passwordChangeForm.handleSubmit(onPasswordChange)}
              className="space-y-8"
            >
              <FormField
                control={passwordChangeForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordChangeForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={passwordIsSubmitting}
                className="cursor-pointer"
              >
                {passwordIsSubmitting ? "Changing..." : "Change"}
              </Button>
            </form>
          </Form>
        </Card>

        <Card className="p-4">
          <Form {...twoFaForm}>
            <form
              onSubmit={twoFaForm.handleSubmit(onTwoFaChange)}
              className="space-y-8"
            >
              <FormField
                control={twoFaForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable 2FA</FormLabel>
                      <FormDescription>
                        Enhance your account security by enabling Two Factor
                        Authentication.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="cursor-pointer"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={twoFaForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={twoFaIsSubmitting}
                type="submit"
                className="cursor-pointer"
              >
                {twoFaIsSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default AccountSecurityPage;
