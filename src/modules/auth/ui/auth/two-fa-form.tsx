"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const TwoFaForm = () => {
  const t = useTranslations("auth.two-fa-form");
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmitOtp(values: z.infer<typeof FormSchema>) {
    await authClient.twoFactor.verifyOtp(
      { code: values.otp },
      {
        onSuccess() {
          toast("Verified Successfully!");
          router.push("/bezs");
        },
        onError(ctx) {
          toast("An error occurred!", {
            description: <span className="">{ctx.error.message}</span>,
          });
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subTitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitOtp)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("otpInputLable")}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>{t("otpInputDesc")}</FormDescription>
                  <FormMessage />
                  <div>
                    <Button
                      type="button"
                      variant="link"
                      className="cursor-pointer pl-0 underline hover:text-blue-600"
                      onClick={async () => {
                        const { data, error } =
                          await authClient.twoFactor.sendOtp();

                        if (error) {
                          toast("An error occurred!", {
                            description: (
                              <span className="dark:text-zinc-400">
                                {error.message}
                              </span>
                            ),
                          });
                          return;
                        }

                        toast("OTP Sent Successfully!", {
                          description: <span>{"Check your email."}</span>,
                        });
                      }}
                    >
                      {t("reqOTP")}
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("buttonLableSubmitting") : t("buttonLable")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TwoFaForm;
