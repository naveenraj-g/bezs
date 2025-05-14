/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { endOfMonth, format, getMonth, startOfYear } from "date-fns";

type AppointmentStatus = "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  status: AppointmentStatus;
  appointment_date: Date;
}

function isValidStatus(status: string): status is AppointmentStatus {
  return ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(status);
}

const initializeMonthlyData = () => {
  const this_year = new Date().getFullYear();

  const months = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index) => ({
      name: format(new Date(this_year, index), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );
  return months;
};

export const processAppointments = async (appointments: Appointment[]) => {
  const monthlyData = initializeMonthlyData();

  const appointmentCounts = appointments.reduce<
    Record<AppointmentStatus, number>
  >(
    (acc, appointment) => {
      const status = appointment.status;

      const appointmentDate = appointment?.appointment_date;

      const monthIndex = getMonth(appointmentDate);

      if (
        appointmentDate >= startOfYear(new Date()) &&
        appointmentDate <= endOfMonth(new Date())
      ) {
        monthlyData[monthIndex].appointment += 1;

        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
      }

      // Grouping by status
      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {
      PENDING: 0,
      SCHEDULED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    }
  );

  return { appointmentCounts, monthlyData };
};

export async function getPatientDashboardData() {
  const session = await getServerSession();

  if (!session || session?.user?.role !== "patient") {
    throw new Error("Unauthorized");
  }

  const patientData = await prismaTeleMedicine.patient.findUnique({
    where: {
      userId: session?.user?.id,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      gender: true,
      img: true,
    },
  });

  if (!patientData) {
    throw new Error("Patient not found");
  }

  const appointments = await prismaTeleMedicine.appointment.findMany({
    where: {
      patient_id: patientData?.id,
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          img: true,
          specialization: true,
        },
      },
    },
    orderBy: {
      appointment_date: "desc",
    },
  });

  const { appointmentCounts, monthlyData } =
    await processAppointments(appointments);
  const last5Records = appointments.slice(0, 5);

  const avaliableDoctor = await prismaTeleMedicine.doctor.findMany({
    select: {
      id: true,
      name: true,
      specialization: true,
      img: true,
    },
    take: 6,
  });

  return {
    patientData,
    appointmentCounts,
    last5Records,
    totalAppointments: appointments.length,
    avaliableDoctor: null,
    monthlyData,
  };
}
