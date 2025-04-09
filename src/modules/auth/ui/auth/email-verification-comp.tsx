"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";

const EmailVerificationComp = ({ email }: { email: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Hey, we send email verification email to your email go and verify
          email. If you verified email then refresh this page. If email not
          received then{" "}
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
            request again
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationComp;
