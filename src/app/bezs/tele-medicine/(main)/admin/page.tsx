import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const AdminDashboardPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <h1>Admin Dashboard</h1>
    </>
  );
};

export default AdminDashboardPage;
