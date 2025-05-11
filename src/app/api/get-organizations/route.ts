import { prismaMain } from "@/lib/prisma";
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
    const organizations = await prismaMain.organization.findMany({
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
            members: true,
            appOrganization: true,
          },
        },
      },
    });

    const organizationsLength = await prismaMain.organization.count();

    return NextResponse.json({ organizations, length: organizationsLength });
  } catch (err) {
    return NextResponse.json({ error: "User not found", err }, { status: 404 });
  }
}
