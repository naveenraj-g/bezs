"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaFileNest } from "@/lib/prisma";
import { ADMIN_ROLE } from "@/modules/filenest/utils/roles";
import { adminCreateCredentialsModalFormSchema } from "@/modules/filenest/schema/admin-credentials-modal-schema";
import { authProcedures } from "@/shared/server-actions/server-action";

export async function getAllCredentialsData() {
  const session = await getServerSession();

  if (!session || session?.user?.role !== ADMIN_ROLE) {
    throw new Error("Unauthorized!");
  }

  const credentialsData =
    await prismaFileNest.cloudStorageCredentials.findMany();
  const total = await prismaFileNest.cloudStorageCredentials.count();

  return { credentialsData, total };
}

export const createAdminCloudStorageCredentials = authProcedures
  .createServerAction()
  .input(adminCreateCredentialsModalFormSchema)
  .handler(async ({ input }) => {
    await prismaFileNest.cloudStorageCredentials.create({
      data: {
        ...input,
      },
    });

    return { message: "Credentials created successfully!" };
  });

// export async function createAdminCloudStorageCredentials(
//   data: z.infer<typeof adminCreateCredentialsModalFormSchema>
// ) {
//   const session = await getServerSession();

//   if (!session || session?.user?.role !== ADMIN_ROLE) {
//     throw new Error("Unauthorized!");
//   }

//   const validateData = adminCreateCredentialsModalFormSchema.safeParse(data);

//   if (!validateData.success) {
//     throw new Error("Invalid data");
//   }

//   try {
//     await prismaFileNest.cloudStorageCredentials.create({
//       data: {
//         ...data,
//       },
//     });
//   } catch (err) {
//     throw new Error(err);
//   }
// }
