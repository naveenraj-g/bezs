// lib/prisma.ts
import { PrismaClient as PrismaMainClient } from "../../prisma/generated/main";
import { PrismaClient as PrismaTeleMedicineClient } from "../../prisma/generated/telemedicine";

const globalForPrisma = global as unknown as {
  prismaMain: PrismaMainClient | undefined;
  prismaTeleMedicine: PrismaTeleMedicineClient | undefined;
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

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaMain = prismaMain;
  globalForPrisma.prismaTeleMedicine = prismaTeleMedicine;
}
