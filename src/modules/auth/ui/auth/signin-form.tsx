"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { authClient } from "../../services/better-auth/auth-client";
import { toast } from "sonner";
import OauthButton from "./oauth-button";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const router = useRouter();
  const t = useTranslations("auth.signin");
  const [isForgetClick, setIsForgetClick] = useState(false);
  const [inputType, setInputType] = useState("password");

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignInForm) {
    const { email, password } = values;

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/bezs",
      },
      {
        onSuccess: async () => {
          toast("Success!");
          await authClient.twoFactor.sendOtp();
          router.push("/2fa-verification");
        },
        onError(ctx) {
          // console.log(ctx);
          // if ((ctx.error.code = "EMAIL_NOT_VERIFIED")) {
          //   router.push(`/email-verification?email=${form.getValues("email")}`);
          // }
          toast("Error!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  function handleInputTypeChange() {
    setInputType((prevState) =>
      prevState === "password" ? "text" : "password"
    );
  }

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailInputLable")}</FormLabel>
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
                    <FormLabel>{t("passwordInputLable")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="******"
                          {...field}
                          type={inputType}
                          maxLength={16}
                        />
                        {inputType === "password" ? (
                          <EyeOff
                            className="w-4 h-4 absolute top-[25%] right-3.5 cursor-pointer"
                            onClick={handleInputTypeChange}
                          />
                        ) : (
                          <Eye
                            className="w-4 h-4 absolute top-[25%] right-3.5 cursor-pointer"
                            onClick={handleInputTypeChange}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center justify-end w-full h-fit">
                      <Button
                        variant="link"
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setIsForgetClick(true)}
                      >
                        {t("forgetPass")}
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              <p>
                {t("createAccount")}{" "}
                <Link
                  href="/signup"
                  className="text-blue-400 underline-offset-4 hover:underline"
                >
                  {t("signupLink")}
                </Link>
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-md cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  t("buttonLable")
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center my-3">{t("or")}</p>
          <div className="space-y-1">
            <OauthButton
              oauthName="google"
              label={t("googleOauthLable")}
              isFormSubmitting={isSubmitting}
            />
            <OauthButton
              oauthName="github"
              label={t("githubOauthLable")}
              isFormSubmitting={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>
      <ForgetPasswordAlert
        isForgetClick={isForgetClick}
        setIsForgetClick={setIsForgetClick}
      />
    </>
  );
}

//////////////////////////////////////////////////////////////////

const forgetPasswordAlertSchema = z.object({
  email: z.string().email(),
});

type ForgetPasswordForm = z.infer<typeof forgetPasswordAlertSchema>;

export function ForgetPasswordAlert({
  isForgetClick,
  setIsForgetClick,
}: {
  isForgetClick: boolean;
  setIsForgetClick: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations("auth.forgetPassDialog");

  const form = useForm<ForgetPasswordForm>({
    resolver: zodResolver(forgetPasswordAlertSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ForgetPasswordForm) {
    const { email } = values;

    await authClient.forgetPassword(
      {
        email,
        redirectTo: "/reset-password",
      },
      {
        onSuccess() {
          toast("Success!", {
            description: (
              <span className="">{"Check your mail to change password."}</span>
            ),
          });
          setIsForgetClick(false);
        },
        onError(ctx) {
          toast("An Error Occurred!", {
            description: <span className="">{ctx.error.message}</span>,
          });
        },
      }
    );
  }

  return (
    <Dialog open={isForgetClick} onOpenChange={setIsForgetClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">{t("title")}</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("formLable")}</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {" "}
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("submitBtnLable")
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
