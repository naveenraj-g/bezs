"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { authClient } from "../../services/better-auth/auth-client";
import { toast } from "sonner";
import OauthButton from "./oauth-button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signUpFormSchema = z.object({
  username: z
    .string()
    .min(2, "Username must have atleast two characters")
    .max(15, "Username must have atmost 20 characters"),
  name: z
    .string()
    .min(2, "Name must have atleast two characters")
    .max(20, "Name must have atmost 20 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

type SignUpForm = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
  const t = useTranslations("auth.signup");
  const router = useRouter();
  const [inputType, setInputType] = useState("password");

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignUpForm) {
    const { email, name, password, username } = values;

    await authClient.signUp.email(
      {
        username,
        email,
        name,
        password,
        callbackURL: "/bezs",
      },
      {
        onSuccess() {
          toast("Success!");
          router.push(`/email-verification?email=${email}`);
        },
        onError(ctx) {
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
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("usernameInputLable")}</FormLabel>
                  <FormControl>
                    <Input placeholder="@username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameInputLable")}</FormLabel>
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
                </FormItem>
              )}
            />
            <p>
              {t("existAccount")}{" "}
              <Link
                href="/signin"
                className="text-blue-400 underline-offset-4 hover:underline"
              >
                {t("signinLink")}
              </Link>
            </p>
            <Button
              type="submit"
              className="w-full text-md cursor-pointer"
              disabled={isSubmitting}
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
  );
}
