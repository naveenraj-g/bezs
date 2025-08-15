"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { bookAppointmentFormSchema } from "../../schemas/book-appointment-form-schema";
import { nanoid } from "nanoid";
import { Prisma } from "@prisma/client";
import { AppointmentMode } from "../../../../../prisma/generated/telemedicine";

type AppointmentDataType = {
  date: Date | string;
  appointmentType: string;
  doctorId: string;
  time: string;
  note: string;
  appointmentMode: AppointmentMode;
};

async function generateUniqueRoomId(prefix = "room_", length = 10) {
  let roomId: string = "";
  let exists = true;

  while (exists) {
    roomId = `${prefix}${nanoid(length)}`;
    const existing = await prismaTeleMedicine.appointment.findUnique({
      where: {
        livekit_room_id: roomId,
      },
    });
    exists = !!existing;
  }

  return roomId;
}

export const createDoctorAppointment = async (
  appointmentData: AppointmentDataType,
  { patientId, userId }: { patientId?: string; userId?: string }
) => {
  const session = await getServerSession();

  if (!session || session?.user?.role !== "telemedicine-patient") {
    throw new Error("Unauthorized");
  }

  if (userId) {
    const patient = await prismaTeleMedicine.patient.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    patientId = patient?.id;
  }

  const validateData = bookAppointmentFormSchema.safeParse(appointmentData);

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  if (!patientId) {
    throw new Error("Can't find user");
  }

  const isVideoAppointment = validateData.data.appointmentMode === "VIDEO";

  try {
    const data = await prismaTeleMedicine.appointment.create({
      data: {
        patient_id: patientId,
        doctor_id: validateData.data.doctorId,
        appointment_date: validateData.data.date.toISOString(),
        time: validateData.data.time,
        type: validateData.data.appointmentType,
        note: validateData.data.note,
        appointment_mode: validateData.data.appointmentMode,
        livekit_room_id: isVideoAppointment
          ? await generateUniqueRoomId("room_", 10)
          : null,
      },
    });

    return data.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          // Unique constraint failed (likely on livekit_room_id)
          throw new Error(
            "A similar appointment already exists. Please try again."
          );
        case "P2025":
          // Record not found (on update/delete usually)
          throw new Error("Referenced data not found.");
        // Add more cases as needed
        default:
          console.error("Prisma error:", error);
          throw new Error(
            "Something went wrong while creating the appointment."
          );
      }
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};
