import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const DoctorProfilePage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex justify-center">
      <h1>Doctor profile page</h1>
    </div>
  );
};

export default DoctorProfilePage;
