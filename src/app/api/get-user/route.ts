import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const session = await getServerSession();

  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "User not found", err }, { status: 404 });
  }
}
