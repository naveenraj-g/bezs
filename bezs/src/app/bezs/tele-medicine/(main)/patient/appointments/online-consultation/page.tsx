import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { TAIDoctorData } from "@/modules/telemedicine/types/online-consult-types";
import { AiDoctorConsult } from "@/modules/telemedicine/ui/online-consultation/AiDoctorConsult";
import { MediaRoom } from "@/modules/telemedicine/ui/video/media-room";
import { redirect } from "next/navigation";

const PatientOnlineConsultationPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;

  const session = await getServerSession();

  if (!session) redirect("/");

  const userId = session?.user.id;

  const appointmentData = await prismaTeleMedicine.appointment.findUnique({
    where: {
      id: +params.appointmentId!,
    },
    select: {
      id: true,
      patient_id: true,
      doctor_id: true,
      appointment_date: true,
      appointment_mode: true,
      note: true,
      time: true,
      doctor: {
        select: {
          id: true,
          orgId: true,
          name: true,
          specialization: true,
          description: true,
          agentPrompt: true,
          voiceId: true,
          img: true,
          doctorType: true,
        },
      },
      patient: {
        select: {
          id: true,
          userId: true,
          orgId: true,
          name: true,
          email: true,
          gender: true,
          blood_group: true,
          img: true,
          date_of_birth: true,
        },
      },
    },
  });

  return (
    <>
      {params.roomId ? (
        <div className="h-[500px]">
          <MediaRoom
            chatId={params.roomId}
            name={appointmentData?.patient.name || ""}
            audio={true}
            video={true}
          />
        </div>
      ) : params.appointmentId ? (
        <>
          <AiDoctorConsult appointmentData={appointmentData} />
        </>
      ) : (
        <>No Id</>
      )}
    </>
  );
};

export default PatientOnlineConsultationPage;
