import { UserRolesManage } from "@/modules/account/ui/user-roles-manage";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const RolesPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="w-full">
      <h1 className="text-xl">Roles</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300/80">
        Manage your roles.
      </p>
      <UserRolesManage
        rbacSessionData={session?.userRBAC}
        currentRole={session.user.role}
        userId={session.user.id}
      />
    </div>
  );
};

export default RolesPage;
