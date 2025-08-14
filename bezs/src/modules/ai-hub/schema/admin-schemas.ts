import { nativeEnum, z } from "zod";
import {
  AiModelType,
  KnowledgeBasedType,
  Status,
} from "../../../../prisma/generated/ai-hub";

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

  defaultPrompt: z.string().min(15, {
    message: "Default Prompt should be atleast 15 characters long",
  }),
  maxToken: z.number().min(1, { message: "Max Token is required" }),
  temperature: z
    .number()
    .min(0.1, { message: "Temperature should be atleast 0.1" })
    .max(1, { message: "Temperature should be atmost 1" }),
  topP: z
    .number()
    .min(0.1, { message: "topP should be atleast 0.1" })
    .max(1, { message: "topP should be atmost 1" }),
  topK: z.number().max(100, { message: "topK should be atmost 100" }),
});

export const AdminEditAiModelSchema = AdminCreateAiModelSchema.merge(
  z.object({
    id: z.string().min(1, { message: "Id is required" }),
  })
);

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
  role: z.string().min(1, { message: "Role is required" }),
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
  role: z.string().min(1, { message: "Role is required" }),
  roleId: z.union([
    z.string({ invalid_type_error: "Model ID must be a number or string." }),
    z.number({ invalid_type_error: "Model ID must be a number or string." }),
  ]),
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

export const AdminCreateModelSettingsSchema = z.object({
  modelId: z.string().min(1, { message: "Model ID is required" }),

  defaultPrompt: z
    .string()
    .min(15, {
      message: "Default Prompt should be at least 15 characters long",
    })
    .default("You are a helpful assistant."),

  maxToken: z
    .number()
    .min(1, { message: "Max Token is required" })
    .default(1000),

  temperature: z
    .number()
    .min(0.1, { message: "Temperature should be at least 0.1" })
    .max(1, { message: "Temperature should be at most 1" })
    .default(0.5),

  topP: z
    .number()
    .min(0.1, { message: "topP should be at least 0.1" })
    .max(1, { message: "topP should be at most 1" })
    .default(1),

  topK: z
    .number()
    .max(100, { message: "topK should be at most 100" })
    .default(5),
});

export const AdminEditModelSettingsSchema =
  AdminCreateModelSettingsSchema.merge(
    z.object({
      id: z.union([
        z
          .string({
            invalid_type_error: "Prompt ID must be a number or string.",
          })
          .min(1, { message: "Prompt ID is required." }),
        z
          .number({
            invalid_type_error: "Prompt ID must be a number or string.",
          })
          .min(1, { message: "Prompt ID is required." }),
      ]),
    })
  );

export const AdminCreateKnowledgeBasedSchema = z.object({
  name: z.string().min(1, { message: "Knowledge base name is required" }),

  type: z.nativeEnum(KnowledgeBasedType, {
    required_error: "Type is required",
    invalid_type_error: "Invalid type value",
  }),

  connections: z.string().min(1, { message: "Connections string is required" }),

  assistantId: z
    .number({ invalid_type_error: "Assistant ID must be a number" })
    .int({ message: "Assistant ID must be an integer" }),
});

export const AdminKnowledgeBasedAssistantIdSchema = z.object({
  assistantId: z
    .number({ invalid_type_error: "Assistant ID must be a number" })
    .int({ message: "Assistant ID must be an integer" }),
});
