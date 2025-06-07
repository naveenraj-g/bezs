import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { TelemedicinePatientModalProvider } from "@/modules/telemedicine/providers/telemedicine-patient-modal-provider";
import { redirect } from "next/navigation";

const PatientLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <TelemedicinePatientModalProvider />
      {children}
    </>
  );
};

export default PatientLayout;
