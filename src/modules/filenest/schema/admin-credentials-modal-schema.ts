import { z } from "zod";
import { CloudStorageType } from "../../../../prisma/generated/filenest";

export const adminCreateCredentialsModalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CloudStorageType),
  bucketName: z.string().min(1, "Bucket name is required"),
  region: z.string().min(1, "Region is required"),
  clientId: z.string().min(1, "Access key is required"),
  clientSecret: z.string().min(1, "Secure access key is required"),
  maxFileSize: z.coerce
    .number()
    .int()
    .positive("Max file size must be a positive number"),
});
