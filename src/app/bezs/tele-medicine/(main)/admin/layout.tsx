import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { TelemedicineAdminModalProvider } from "@/modules/telemedicine/providers/telemedicine-admin-modal-provider";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <TelemedicineAdminModalProvider />
      {children}
    </>
  );
};

export default AdminLayout;
