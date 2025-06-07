import AccountSecurityPage from "@/modules/account/ui/account-security";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { auth } from "@/modules/auth/services/better-auth/auth";
import { headers } from "next/headers";

const AccountSecurity = async () => {
  const session = await getServerSession();

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return (
    <>
      <h1 className="text-xl">Security</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300/80">
        Manage your account.
      </p>
      <AccountSecurityPage session={session} accounts={accounts} />
    </>
  );
};

export default AccountSecurity;
