import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const DoctorDashboardPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <h1>Doctor Dashboard</h1>
    </>
  );
};

export default DoctorDashboardPage;
