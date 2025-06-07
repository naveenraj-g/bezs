import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { prismaFileNest } from "@/lib/prisma";
import { auth } from "@/modules/auth/services/better-auth/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, fileId } = req.query;

  const session = await auth.api.getSession({
    headers: new Headers(
      Object.entries(req.headers).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(", ") : (v ?? ""),
      ])
    ),
  });

  if (!session) return res.status(403).json({ error: "Unauthorized" });

  if (!fileId || typeof fileId !== "string") {
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
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const mimeType = fileRecord.fileType;

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send("Requested range not satisfiable");
        return;
      }

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": mimeType,
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${fileRecord.fileName}"`,
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("File preview error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
