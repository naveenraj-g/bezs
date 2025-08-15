"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

export const getInitialAppointmentBookingData = async (userId: string) => {
  const session = await getServerSession();

  if (!session || session?.user?.role !== "telemedicine-patient") {
    throw new Error("Unauthorized");
  }

  if (!userId) {
    throw new Error("Missing required datas.");
  }

  try {
    const patientData = await prismaTeleMedicine.patient.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        img: true,
        orgId: true,
      },
    });

    const doctorsData = await prismaTeleMedicine.doctor.findMany({
      where: {
        orgId: patientData?.orgId || "",
      },
      select: {
        id: true,
        name: true,
        specialization: true,
        img: true,
        orgId: true,
      },
    });

    return { patientData, doctorsData };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Failed to get datas.");
  }
};
