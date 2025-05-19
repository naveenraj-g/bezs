"use server";

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

export async function getPatientAppointments(patientId: string | undefined) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized.");
  }

  if (!patientId) {
    throw new Error("Missing required datas.");
  }

  const appointmentsData = await prismaTeleMedicine.appointment.findMany({
    where: {
      patient_id: patientId,
    },
    select: {
      id: true,
      patient_id: true,
      doctor_id: true,
      type: true,
      appointment_date: true,
      time: true,
      status: true,
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          gender: true,
          img: true,
          date_of_birth: true,
          colorCode: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,
          img: true,
          colorCode: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const appointmentsCount = await prismaTeleMedicine.appointment.count({
    where: {
      patient_id: patientId,
    },
  });

  return { appointmentsData, appointmentsCount };
}
