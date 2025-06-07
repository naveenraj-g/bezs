import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { TelemedicineDoctorModalProvider } from "@/modules/telemedicine/providers/telemedicine-doctor-modal-provider";
import { redirect } from "next/navigation";

const DoctorLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <TelemedicineDoctorModalProvider />
      {children}
    </>
  );
};

export default DoctorLayout;
