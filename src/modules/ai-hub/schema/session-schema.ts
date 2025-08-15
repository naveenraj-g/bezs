import { z } from "zod";

export const chatMessageForDBSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  model: z.string(),
  rawHuman: z.string(),
  rawAI: z.any(),
  toolName: z.string().optional(),
  context: z.string().optional(),
  image: z.string().optional(),
  role: z.string(),
  type: z.string(),
  query: z.string(),
});
