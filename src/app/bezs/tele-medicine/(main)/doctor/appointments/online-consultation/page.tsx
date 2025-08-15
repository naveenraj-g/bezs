import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { MediaRoom } from "@/modules/telemedicine/ui/video/media-room";
import { redirect } from "next/navigation";

const DoctorOnlineConsultationPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const session = await getServerSession();

  if (!session) redirect("/");

  const userId = session?.user.id;

  const doctorData = await prismaTeleMedicine.doctor.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      orgId: true,
      name: true,
      email: true,
      specialization: true,
      img: true,
      role: true,
    },
  });

  if (!params.roomId) {
    return (
      <>
        <h1>No Room Id</h1>
      </>
    );
  }

  return (
    <>
      <h1>Doctor Video page</h1>
      <p>LivekitId - {params.roomId}</p>
      <div className="h-[500px]">
        <MediaRoom
          chatId={params.roomId}
          name={"Doctor"}
          audio={true}
          video={true}
        />
      </div>
    </>
  );
};

export default DoctorOnlineConsultationPage;
