import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const AdminPage = async () => {
  return (
    <div className="p-4 space-y-8 max-w-[1240px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p>Manage Users</p>
      </div>
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href="/bezs/admin/manage-users"
      >
        Manage Users
      </Link>
    </div>
  );
};

export default AdminPage;
