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

export const createAIDoctorFormSchema = z.object({
  name: z
    .string({
      required_error: "Doctor name is required",
      invalid_type_error: "Doctor name must be a string",
    })
    .min(2, { message: "Doctor name must be at least 2 characters long" })
    .max(30, { message: "Doctor name must be less than 100 characters" }),

  specialization: z
    .string({
      required_error: "Specialization is required",
      invalid_type_error: "Specialization must be a string",
    })
    .min(2, { message: "Specialization must be at least 2 characters long" })
    .max(100, { message: "Specialization must be less than 100 characters" }),

  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(2, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description must be less than 1000 characters" }),

  agentPrompt: z
    .string({
      required_error: "Agent prompt is required",
      invalid_type_error: "Agent prompt must be a string",
    })
    .min(2, { message: "Agent prompt must be at least 20 characters long" })
    .max(5000, { message: "Agent prompt must be less than 5000 characters" }),

  voiceId: z
    .string({
      required_error: "Voice ID is required",
      invalid_type_error: "Voice ID must be a string",
    })
    .min(1, { message: "Voice ID cannot be empty" })
    .max(30, { message: "Voice ID must be less than 30 characters" }),
  img: z
    .string({
      required_error: "Image path is required",
      invalid_type_error: "Image path name must be a string",
    })
    .min(2, { message: "Image path must be at least 2 characters long" })
    .max(100, { message: "Image path must be less than 100 characters" }),
});
