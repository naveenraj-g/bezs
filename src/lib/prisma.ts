// lib/prisma.ts
import { PrismaClient as PrismaMainClient } from "../../prisma/generated/main";
import { PrismaClient as PrismaTeleMedicineClient } from "../../prisma/generated/telemedicine";
import { PrismaClient as PrismaFileNestClient } from "../../prisma/generated/filenest";

const globalForPrisma = global as unknown as {
  prismaMain: PrismaMainClient | undefined;
  prismaTeleMedicine: PrismaTeleMedicineClient | undefined;
  prismaFileNest: PrismaFileNestClient | undefined;
};

export const prismaMain =
  globalForPrisma.prismaMain ??
  new PrismaMainClient({
    log: ["error", "warn"],
  });

export const prismaTeleMedicine =
  globalForPrisma.prismaTeleMedicine ??
  new PrismaTeleMedicineClient({
    log: ["error", "warn"],
  });

export const prismaFileNest =
  globalForPrisma.prismaFileNest ??
  new PrismaFileNestClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaMain = prismaMain;
  globalForPrisma.prismaTeleMedicine = prismaTeleMedicine;
}
