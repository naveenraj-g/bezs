"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";

export async function getSignedURL() {
  const session = await getServerSession();

  if (!session) throw new Error("unauthorized!");

  return { url: "" };
}
