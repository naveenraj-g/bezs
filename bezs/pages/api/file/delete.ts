import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { prismaFileNest } from "@/lib/prisma";
import { auth } from "@/modules/auth/services/better-auth/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, fileId } = req.body;

  const session = await auth.api.getSession({
    headers: new Headers(
      Object.entries(req.headers).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(", ") : (v ?? ""),
      ])
    ),
  });

  if (!session) return res.status(403).json({ error: "Unauthorized" });

  if (!id || !fileId || typeof fileId !== "string") {
    return res.status(400).json({ error: "Missing or invalid fileId" });
  }

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

    const filePath = fileRecord.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File does not exist on server" });
    }

    // Delete the file from the filesystem
    await fs.promises.unlink(filePath);

    // Optionally: remove the record from the database too
    await prismaFileNest.userFile.delete({
      where: { id: fileRecord.id, fileId: fileRecord.fileId },
    });

    return res.status(200).json({ message: "File deleted successfully" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
