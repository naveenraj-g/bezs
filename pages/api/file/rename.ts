import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { prismaFileNest } from "@/lib/prisma";
import { auth } from "@/modules/auth/services/better-auth/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, fileId, newFileName } = req.body;

  console.log({ id, fileId, newFileName });

  if (!id || !fileId || !newFileName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const session = await auth.api.getSession({
    headers: new Headers(
      Object.entries(req.headers).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(", ") : (v ?? ""),
      ])
    ),
  });

  if (!session) return res.status(403).json({ error: "Unauthorized" });

  try {
    const fileRecord = await prismaFileNest.userFile.findFirst({
      where: {
        id: Number(id),
        fileId,
        userId: session.user.id,
      },
    });

    if (!fileRecord || fileRecord.filePathType !== "LOCAL") {
      return res.status(404).json({ error: "File not found" });
    }

    const oldPath = fileRecord.filePath;
    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    const fileDir = path.dirname(oldPath);
    const originalExt = path.extname(fileRecord.fileName);
    const baseName = path.basename(newFileName, path.extname(newFileName));
    const newFileNameWithExt = `${Date.now()}-${baseName}${originalExt}`;
    const newPath = path.join(fileDir, newFileNameWithExt);

    // Rename the file on disk
    await fs.promises.rename(oldPath, newPath);

    // Update DB record
    await prismaFileNest.userFile.update({
      where: { id: fileRecord.id, fileId: fileRecord.fileId },
      data: {
        filePath: newPath,
        fileName: `${baseName}${originalExt}`,
      },
    });

    return res.status(200).json({ message: "File renamed successfully" });
  } catch (error) {
    console.error("Rename error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
