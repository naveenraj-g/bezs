/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { ScheduleAppointmentFormSchemaType } from "../../types/data-types";
import { scheduleAppointmentFormSchema } from "../../schemas/schedule-appointment-form-schema";

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
      orderBy: {
        created_at: "desc",
      },
    });

    const appointmentsCount = appointmentsData.length;

    return { appointmentsData, appointmentsCount };
  } catch (err) {
    throw new Error("Failed to get data.");
  }
};

export const confirmPatientAppointment = async (
  appointmentId: number | undefined
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

export const reschedulePatientAppointment = async (
  data: ScheduleAppointmentFormSchemaType,
  appointmentId: number | undefined
) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized.");
  }

  const validateData = scheduleAppointmentFormSchema.safeParse(data);

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      appointment_date: validateData.data.date,
      time: validateData.data.time,
    },
  });
};

export const cancelPatientAppointment = async (
  appointmentId: number | undefined
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
        status: "CANCELLED",
      },
    });
  } catch (err) {
    throw new Error("Something went wrong.");
  }
};
