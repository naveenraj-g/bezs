/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { auth } from "@/modules/auth/services/better-auth/auth";

async function getData(userName: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: userName,
    },
  });

  return user;
}

export async function addMemberToOrg({
  userName,
  organizationId,
  role = "member",
}: {
  userName: string;
  organizationId: string;
  role?: "member" | "admin" | "owner";
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  const user = await getData(userName);
  if (!user) {
    throw new Error("User not found");
  }

  const userId = user?.id;

  await auth.api.addMember({
    body: {
      userId,
      organizationId,
      role,
    },
  });
}

export async function addRole({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  if (!name || !description) {
    throw new Error("Missing required datas.");
  }

  await prisma.roles.create({
    data: {
      name,
      description,
    },
  });
}
