"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RiGoogleFill, RiGithubFill } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";

type Props = {
  oauthName: "google" | "github";
  label: string;
  isFormSubmitting: boolean;
};

const OauthButton = ({ oauthName, label, isFormSubmitting }: Props) => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  return (
    <div className="w-full space-y-3 mt-3">
      <Button
        disabled={isAuthLoading || isFormSubmitting}
        className=" after:flex-1 w-full cursor-pointer text-md"
        onClick={async () => {
          setIsAuthLoading(true);
          await authClient.signIn.social(
            {
              provider: oauthName,
              callbackURL: "/bezs",
            },
            {
              onSuccess() {
                toast("Success!");
              },
              onError(ctx) {
                toast("An error occurred!", {
                  description: (
                    <span className="dark:text-zinc-400">
                      {ctx.error.message}
                    </span>
                  ),
                });
              },
              onRequest() {
                setIsAuthLoading(true);
              },
              onResponse() {
                setIsAuthLoading(false);
              },
            }
          );
        }}
      >
        <span className="pointer-events-none flex-1">
          {!isAuthLoading ? (
            oauthName === "google" ? (
              <RiGoogleFill className="" size={18} aria-hidden="true" />
            ) : (
              <RiGithubFill size={18} aria-hidden="true" />
            )
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </span>
        Login with {label}
      </Button>
    </div>
  );
};

export default OauthButton;
