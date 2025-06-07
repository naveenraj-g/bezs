import { z } from "zod";

export const createDoctorFormSchema = z.object({
  userId: z.string().min(2, { message: "Must select a user." }),
  specialization: z
    .string()
    .min(2, { message: "Specialization must be atleast 2 characters." }),
  license_number: z
    .string()
    .min(2, { message: "License number must be atleast 2 characters." }),
  phone: z.string().min(10, "Enter phone number").max(10, "Enter phone number"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
});
