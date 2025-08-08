import { nativeEnum, z } from "zod";
import { AiModelType, Status } from "../../../../prisma/generated/ai-hub";

export const AdminCreateAiModelSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required" }),
  modelName: z.string().min(1, { message: "Model name is required" }),
  tokens: z.string().min(1, { message: "Tokens is required" }),
  type: z.nativeEnum(AiModelType, {
    required_error: "Type is required",
    invalid_type_error: "Invalid model type",
  }),
  secretKey: z.string().min(1, { message: "Secret key is required" }),
  modelUrl: z.string().min(1, { message: "Model URL is required" }),
});

export const AdminDeleteAiModelSchema = z.object({
  modelId: z.union([
    z
      .string({ invalid_type_error: "Model ID must be a number or string." })
      .min(1, { message: "Model ID is required." }),
    z
      .number({ invalid_type_error: "Model ID must be a number or string." })
      .min(1, { message: "Model ID is required." }),
  ]),
});

export const AdminCreatePromptsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters long" }),
  status: nativeEnum(Status),
});

export const AdminEditPromptByIdSchema = z.object({
  id: z.number().min(1, { message: "Id is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters long" }),
  status: nativeEnum(Status),
});

export const AdminDeletePromptSchema = z.object({
  promptId: z.union([
    z
      .string({ invalid_type_error: "Prompt ID must be a number or string." })
      .min(1, { message: "Prompt ID is required." }),
    z
      .number({ invalid_type_error: "Prompt ID must be a number or string." })
      .min(1, { message: "Prompt ID is required." }),
  ]),
});

export const AdminCreateAssistantSchema = z.object({
  modelId: z
    .union([
      z.string({ invalid_type_error: "Model ID must be a number or string." }),
      z.number({ invalid_type_error: "Model ID must be a number or string." }),
    ])
    .nullable(),
  name: z.string().min(1, { message: "Assistant name is required" }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters long" }),
  greeting_message: z.string().min(10, {
    message: "Greeting message must be at least 10 characters long",
  }),
  prompt: z
    .string()
    .min(15, { message: "Prompt must be at least 15 characters long" }),
  status: nativeEnum(Status),
});

export const AdminEditAssistantSchema = z.object({
  id: z.number().min(1, { message: "Id is required" }),
  modelId: z
    .union([
      z.string({ invalid_type_error: "Model ID must be a number or string." }),
      z.number({ invalid_type_error: "Model ID must be a number or string." }),
    ])
    .nullable(),
  name: z.string().min(1, { message: "Assistant name is required" }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters long" }),
  greeting_message: z.string().min(10, {
    message: "Greeting message must be at least 10 characters long",
  }),
  prompt: z
    .string()
    .min(15, { message: "Prompt must be at least 15 characters long" }),
  status: nativeEnum(Status),
});

export const AdminDeleteAssistantSchema = z.object({
  assistantId: z.union([
    z
      .string({
        invalid_type_error: "Assistant ID must be a number or string.",
      })
      .min(1, { message: "Prompt ID is required." }),
    z
      .number({
        invalid_type_error: "Assistant ID must be a number or string.",
      })
      .min(1, { message: "Prompt ID is required." }),
  ]),
});
