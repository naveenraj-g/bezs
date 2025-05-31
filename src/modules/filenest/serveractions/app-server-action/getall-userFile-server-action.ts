"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { prismaFileNest } from "@/lib/prisma";
import { authProcedures } from "@/shared/server-actions/server-action";
import { z } from "zod";
import { getMimeTypeFilter } from "@/utils/helper";

const InputSchema = z.object({
  pathname: z.string().min(1, { message: "pathname is required." }),
  fileType: z
    .enum(["document", "image", "video", "audio", "others"])
    .optional(),
});

export const getAllUserFileData = authProcedures
  .createServerAction()
  .input(InputSchema)
  .handler(async ({ input }) => {
    const session = await getServerSession();

    if (!session) {
      throw new Error("User session not found.");
    }

    const userId = session?.user.id;
    const pathname = input.pathname;

    const splittedPath = pathname.split("/");
    const formattedPathSlug = splittedPath.slice(0, 3).join("/");

    let orgId = "";
    let appId = "";

    for (const rbac of session.userRBAC) {
      for (const app of rbac.organization.appOrganization) {
        if (app.app.slug === formattedPathSlug) {
          orgId = rbac.organization.id || "";
          appId = app.appId || "";
          break;
        }
      }
      if (orgId && appId) break;
    }

    if (!orgId || !appId) {
      throw new Error("Organization or App not found for the current user.");
    }

    const fileTypeFilter = getMimeTypeFilter(input.fileType);

    const userFilesData = await prismaFileNest.userFile.findMany({
      where: {
        userId,
        appId,
        orgId,
        ...fileTypeFilter,
      },
    });

    return { userFilesData };
  });
