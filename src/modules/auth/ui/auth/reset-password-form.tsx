/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const resetPassFormSchema = z.object({
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
});

type resetPassForm = z.infer<typeof resetPassFormSchema>;

export function ResetPassForm() {
  const t = useTranslations("auth.resetPassword");
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(searchParams.get("token"));
  }, [searchParams]);

  const form = useForm<resetPassForm>({
    resolver: zodResolver(resetPassFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: resetPassForm) {
    if (!token) {
      toast("An Error Occurred!", {
        description: (
          <span className="dark:text-zinc-400">
            {"Invalid or missing reset token"}
          </span>
        ),
      });
    }

    const { password } = values;
    await authClient.resetPassword(
      {
        newPassword: password,
        token: token || "",
      },
      {
        onSuccess: () => {
          toast("Password reset Successfull!");
          push("/signin");
        },
        onError: (ctx: any) => {
          toast("An Error Occurred!", {
            description: (
              <span className="dark:text-zinc-400">{ctx.error.message}</span>
            ),
          });
        },
      }
    );
  }

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="card-title">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newPasswordInputLable")}</FormLabel>
                    <FormControl>
                      <Input placeholder="*****" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full mx-auto">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    t("buttonLable")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
