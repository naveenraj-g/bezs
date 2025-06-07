import { z } from "zod";

export const scheduleAppointmentFormSchema = z.object({
  date: z.coerce
    .date()
    .refine((val) => val !== undefined, { message: "Please select a date" }),
  time: z.string().min(2, { message: "Please sekect a time" }),
});
