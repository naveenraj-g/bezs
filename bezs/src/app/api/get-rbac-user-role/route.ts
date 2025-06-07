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
    // const rbacData = await prisma.rBAC.findMany({
    //   skip: offset,
    //   take: limit,
    //   orderBy: [
    //     {
    //       user: {
    //         name: "asc",
    //       },
    //     },
    //     {
    //       [sortBy]: sortDirection,
    //     },
    //   ],
    //   where: {
    //     [searchField]: {
    //       [searchOperator]: searchValue,
    //       mode: "insensitive",
    //     },
    //   },
    //   include: {
    //     organization: {
    //       select: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //     user: {
    //       select: {
    //         id: true,
    //         name: true,
    //         username: true,
    //         email: true,
    //       },
    //     },
    //     role: {
    //       select: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });

    const rbacData = await prismaMain.rBAC.findMany({
      orderBy: [
        {
          user: {
            name: "asc",
          },
        },
      ],
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const rbacDataCount = await prismaMain.rBAC.count();

    return NextResponse.json({ rbacData, length: rbacDataCount });
  } catch (err) {
    return NextResponse.json({ error: "Data not found", err }, { status: 404 });
  }
}
