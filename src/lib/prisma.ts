// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prismaMain: PrismaClient | undefined;
  prismaTeleMedicine: PrismaClient | undefined;
};

// Main Database (Bezs)
export const prismaMain =
  globalForPrisma.prismaMain ??
  new PrismaClient({
    datasources: {
      mainDB: {
        url: process.env.DATABASE_URL_MAIN,
      },
    },
  });

// Tele Medicine Database
export const prismaTeleMedicine =
  globalForPrisma.prismaTeleMedicine ??
  new PrismaClient({
    datasources: {
      mainDB: {
        url: process.env.DATABASE_URL_TELE_MEDICINE,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  if (!globalForPrisma.prismaMain) globalForPrisma.prismaMain = prismaMain;
  if (!globalForPrisma.prismaTeleMedicine)
    globalForPrisma.prismaTeleMedicine = prismaTeleMedicine;
}
