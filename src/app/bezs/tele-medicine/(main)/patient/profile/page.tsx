import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { PatientProfile } from "@/modules/telemedicine/ui/patient-profile";
import { redirect } from "next/navigation";

const PatientProfilePage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  const profileData = await prismaTeleMedicine.patient.findUnique({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <div className="flex justify-center">
      <PatientProfile
        data={profileData!}
        type={!profileData ? "create" : "update"}
        user={session?.user}
      />
    </div>
  );
};

export default PatientProfilePage;
