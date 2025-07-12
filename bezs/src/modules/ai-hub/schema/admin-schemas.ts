import { z } from "zod";
import { AiModelType } from "../../../../prisma/generated/ai-hub";

export const AdminCreateAiModelSchema = z.object({
  displayName: z
    .string()
    .min(1, { message: "Display name is required" })
    .nullable(),
  modelName: z.string().min(1, { message: "Model name is required" }),
  tokens: z.string().min(1, { message: "Tokens is required" }),
  type: z.nativeEnum(AiModelType, {
    required_error: "Type is required",
    invalid_type_error: "Invalid model type",
  }),
  secretKey: z.string().min(1, { message: "Secret key is required" }),
  modelUrl: z.string().min(1, { message: "Model URL is required" }).nullable(),
});

export const AdminDeleteAiModelSchema = z.object({
  modelId: z.string().min(1, { message: "Model ID is required." }),
});
