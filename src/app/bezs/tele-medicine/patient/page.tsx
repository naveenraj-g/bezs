import { prismaMain, prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const PatientPage = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/bezs");
  }

  const alreadyHavePatient = false;

  if (!alreadyHavePatient) {
    redirect("/bezs/tele-medicine/patient/onboarding");
  }

  return (
    <>
      <h1>Patient Home Page</h1>
    </>
  );
};

export default PatientPage;
