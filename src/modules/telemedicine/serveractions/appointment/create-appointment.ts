"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { bookAppointmentFormSchema } from "../../schemas/book-appointment-form-schema";

type AppointmentDataType = {
  date: Date;
  appointmentType: string;
  doctorId: string;
  time: string;
  note: string;
};

export const createDoctorAppointment = async (
  appointmentData: AppointmentDataType,
  { patientId }: { patientId: string }
) => {
  const session = await getServerSession();

  if (!session || session?.user?.role !== "telemedicine-patient") {
    throw new Error("Unauthorized");
  }

  const validateData = bookAppointmentFormSchema.safeParse(appointmentData);

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.appointment.create({
    data: {
      patient_id: patientId,
      doctor_id: appointmentData.doctorId,
      appointment_date: appointmentData.date.toISOString(),
      time: appointmentData.time,
      type: appointmentData.appointmentType,
      note: appointmentData.note,
    },
  });
};
