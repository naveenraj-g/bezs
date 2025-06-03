import { z } from "zod";
import { StorageType } from "../../../../prisma/generated/filenest";

export const adminCreateSettingsModalSchema = z
  .object({
    appId: z
      .string({
        required_error: "App ID is required",
        invalid_type_error: "App ID must be a string",
      })
      .nonempty("App ID cannot be empty"),
    basePath: z
      .string({
        invalid_type_error: "Base path must be a string",
      })
      .optional()
      .nullable(),
    subFolder: z
      .string({
        invalid_type_error: "Sub-folder must be a string",
      })
      .optional()
      .nullable(),
    maxFileSize: z.coerce
      .number()
      .int()
      .positive("Max file size must be a positive number")
      .min(10, { message: "File Size must be minimum of 10 MB" }),
    type: z.nativeEnum(StorageType, {
      required_error: "Type is required",
      invalid_type_error: "Type must be either 'LOCAL' or 'CLOUD'",
      message: "Type must be either 'LOCAL' or 'CLOUD'",
    }),
    credentialId: z
      .string({
        required_error: "Credential ID is required",
        invalid_type_error: "Credential ID must be a string",
      })
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "CLOUD" && !data.credentialId) {
      ctx.addIssue({
        path: ["credentialId"],
        code: z.ZodIssueCode.custom,
        message: 'Credential is required on type "CLOUD"',
      });
    }
  });

export const fullAdminSettingsSchema = z
  .object({
    id: z
      .string({
        required_error: "ID is required",
        invalid_type_error: "ID must be a string",
      })
      .optional()
      .nullable(),
    appName: z.string({
      required_error: "App name is required",
      invalid_type_error: "App name must be a string",
    }),
    appSlug: z.string({
      required_error: "App slug is required",
      invalid_type_error: "App slug must be a string",
    }),
    orgId: z.string({
      required_error: "Organization ID is required",
      invalid_type_error: "Organization ID must be a string",
    }),
    orgName: z.string({
      required_error: "Organization name is required",
      invalid_type_error: "Organization name must be a string",
    }),
    appId: z
      .string({
        required_error: "App ID is required",
        invalid_type_error: "App ID must be a string",
      })
      .nonempty("App ID cannot be empty"),
    basePath: z
      .string({
        invalid_type_error: "Base path must be a string",
      })
      .optional()
      .nullable(),
    subFolder: z
      .string({
        invalid_type_error: "Sub-folder must be a string",
      })
      .optional()
      .nullable(),
    maxFileSize: z.coerce
      .number()
      .int()
      .positive("Max file size must be a positive number")
      .min(10, { message: "File Size must be minimum of 10 MB" }),
    type: z.nativeEnum(StorageType, {
      required_error: "Type is required",
      invalid_type_error: "Type must be either 'LOCAL' or 'CLOUD'",
      message: "Type must be either 'LOCAL' or 'CLOUD'",
    }),
    credentialId: z
      .string({
        required_error: "Credential ID is required",
        invalid_type_error: "Credential ID must be a string",
      })
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "CLOUD" && !data.credentialId) {
      ctx.addIssue({
        path: ["credentialId"],
        code: z.ZodIssueCode.custom,
        message: 'Credential is required on type "CLOUD"',
      });
    }
  });

export const deleteAdminSettingsSchema = z.object({
  id: z
    .string({
      required_error: "ID is required",
      invalid_type_error: "ID must be a string",
    })
    .nonempty("Id is required."),
});
