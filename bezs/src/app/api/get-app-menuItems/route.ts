import { prismaMain } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    appId,
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
    const appMenuItems = await prismaMain.appMenuItem.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortDirection,
      },
      where: {
        appId: appId,
        [searchField]: {
          [searchOperator]: searchValue,
          mode: "insensitive",
        },
      },
    });

    const appMenuItemsCount = await prismaMain.appMenuItem.count({
      where: {
        appId,
      },
    });

    return NextResponse.json({ appMenuItems, length: appMenuItemsCount });
  } catch (err) {
    return NextResponse.json({ error: "User not found", err }, { status: 404 });
  }
}
