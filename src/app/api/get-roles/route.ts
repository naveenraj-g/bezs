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
    const roles = await prismaMain.role.findMany({
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
    });

    const rolesCount = await prismaMain.role.count();

    return NextResponse.json({ roles, length: rolesCount });
  } catch (err) {
    return NextResponse.json({ error: "User not found", err }, { status: 404 });
  }
}
