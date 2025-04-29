import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    limit,
    offset,
    sortBy,
    sortDirection,
    searchField,
    searchOperator,
    searchValue,
    filterField,
    filterOperator,
    filterValue,
  } = await req.json();

  const session = await getServerSession();

  if (!session?.user?.role || session?.user.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  try {
    const organizations = await prisma.app.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortDirection,
      },
      where: {
        [searchField]: {
          [searchOperator]: searchValue,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            appMenuItems: true,
            appPermissions: true,
          },
        },
      },
    });

    const organizationsLength = await prisma.organization.count();

    return NextResponse.json({ organizations, length: organizationsLength });
  } catch (err) {
    return NextResponse.json({ error: "User not found", err }, { status: 404 });
  }
}
