import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

export async function getAppointmentById(id: number | undefined) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized.");
  }

  if (!id) {
    throw new Error("Missing required datas.");
  }

  const appointmentData = await prismaTeleMedicine.appointment.findUnique({
    where: {
      id,
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,
          img: true,
        },
      },
      patient: {
        select: {
          id: true,
          name: true,
          date_of_birth: true,
          gender: true,
          img: true,
          address: true,
          phone: true,
        },
      },
    },
  });

  return appointmentData;
}
