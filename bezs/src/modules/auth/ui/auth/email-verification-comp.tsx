"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const EmailVerificationComp = ({ email }: { email: string }) => {
  const t = useTranslations("auth.emailVerification");

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {t("desc")}{" "}
          <span
            className="link cursor-pointer underline"
            onClick={async () => {
              try {
                await authClient.sendVerificationEmail({
                  email,
                  callbackURL: "/bezs",
                });

                toast("Success!");
              } catch (error) {
                toast("Error!", {
                  description: `${error}`,
                });
              }
            }}
          >
            {t("emailReq")}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationComp;
