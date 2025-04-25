import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    return NextResponse.json({ error: "unauthorized." }, { status: 403 });
  }

  const { id, email, ...userDetails } = await req.json();

  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      email: true,
      emailVerified: true,
    },
  });

  if (!userData) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const hasEmailChanged = userData?.email !== email;

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        emailVerified: hasEmailChanged ? false : userData?.emailVerified,
        email: email,
        ...userDetails,
      },
    });

    return NextResponse.json(
      { success: "User updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "User not found.", err },
      { status: 404 }
    );
  }
}
