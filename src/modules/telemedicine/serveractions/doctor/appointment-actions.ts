/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";

export const getDoctorAppointments = async (doctorId: string | undefined) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized.");
  }

  if (!doctorId) {
    throw new Error("Missing required datas.");
  }

  try {
    const appointmentsData = await prismaTeleMedicine.appointment.findMany({
      where: {
        doctor_id: doctorId,
      },
      include: {
        patient: {
          select: {
            id: true,
            userId: true,
            name: true,
            gender: true,
            img: true,
          },
        },
      },
    });

    const appointmentsCount = appointmentsData.length;

    return { appointmentsData, appointmentsCount };
  } catch (err) {
    throw new Error("Failed to get data.");
  }
};

export const confirmPatientAppointment = async (
  appointmentId: string | number
) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized.");
  }

  if (!appointmentId) {
    throw new Error("Missing required datas.");
  }

  try {
    await prismaTeleMedicine.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "SCHEDULED",
      },
    });
  } catch (err) {
    throw new Error("Something went wrong.");
  }
};
