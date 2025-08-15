"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  const session = await getServerSession();

  if (!session) throw new Error("unauthorized!");

  const PutObjectCmd = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: "test-file",
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: session.user.id,
    },
  });

  const signedUr = await getSignedUrl(s3, PutObjectCmd, {
    expiresIn: 60,
  });

  return { url: signedUr };
}
