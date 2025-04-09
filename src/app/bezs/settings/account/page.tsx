import { auth } from "@/modules/auth/services/better-auth/auth";
import { headers } from "next/headers";
import ManageAccount from "@/modules/account/ui/manage-account";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

const AccountSettingsPage = async () => {
  const session = await getServerSession();

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  return (
    <>
      <h1 className="text-xl">Account</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300/80">
        Manage your account.
      </p>
      <ManageAccount session={session} />
    </>
  );
};

export default AccountSettingsPage;
