import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const DoctorLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
};

export default DoctorLayout;
