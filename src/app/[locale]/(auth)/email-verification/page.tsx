import EmailVerificationComp from "@/modules/auth/ui/auth/email-verification-comp";
import { redirect } from "next/navigation";

const EmailVerification = async ({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) => {
  const email = (await searchParams)?.email || "";

  if (!email) {
    redirect("/signin");
  }

  return <EmailVerificationComp email={email} />;
};

export default EmailVerification;
