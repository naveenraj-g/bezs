import AccountSecurityPage from "@/modules/account/ui/account-security";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

const AccountSecurity = async () => {
  const session = await getServerSession();
  return (
    <>
      <h1 className="text-xl">Security</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300/80">
        Manage your account.
      </p>
      <AccountSecurityPage session={session} />
    </>
  );
};

export default AccountSecurity;
