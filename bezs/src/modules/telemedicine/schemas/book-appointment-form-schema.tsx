import { z } from "zod";
import { AppointmentMode } from "../../../../prisma/generated/telemedicine";

export const bookAppointmentFormSchema = z.object({
  appointmentType: z.string().min(2, { message: "Please select a type" }),
  doctorId: z.string().min(2, {
    message: "Please select a doctor",
  }),
  date: z.coerce
    .date()
    .refine((val) => val !== undefined, { message: "Please select a date" }),
  time: z.string().min(2, { message: "Please sekect a time" }),
  appointmentMode: z
    .nativeEnum(AppointmentMode)
    .refine((val) => Object.values(AppointmentMode).includes(val), {
      message: "Please selecta a valid appointment mode",
    }),
  note: z
    .string()
    .min(3, {
      message: "Note must atleast 10 characters long",
    })
    .max(150, {
      message: "Note with in 150 characters long",
    }),
});

export const bookAIDoctorConsultFormSchema = z.object({
  doctorId: z.string().min(2, {
    message: "Please select a doctor",
  }),
  note: z
    .string()
    .min(5, {
      message: "Note must atleast 10 characters long",
    })
    .max(300, {
      message: "Note with in 150 characters long",
    }),
});
