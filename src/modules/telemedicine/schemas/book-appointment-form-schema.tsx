import { z } from "zod";

export const bookAppointmentFormSchema = z.object({
  appointmentType: z.string().min(2, { message: "Please select a type" }),
  doctorId: z.string().min(2, {
    message: "Please select a doctor",
  }),
  date: z.coerce
    .date()
    .refine((val) => val !== undefined, { message: "Please select a date" }),
  time: z.string().min(2, { message: "Please sekect a time" }),
  note: z
    .string()
    .min(10, {
      message: "Note must atleast 10 characters long",
    })
    .max(150, {
      message: "Note with in 150 characters long",
    }),
});
