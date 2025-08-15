// lib/prisma.ts
import { PrismaClient as PrismaMainClient } from "../../prisma/generated/main";
import { PrismaClient as PrismaTeleMedicineClient } from "../../prisma/generated/telemedicine";
import { PrismaClient as PrismaFileNestClient } from "../../prisma/generated/filenest";
import { PrismaClient as PrismaAiHubClient } from "../../prisma/generated/ai-hub";

const globalForPrisma = global as unknown as {
  prismaMain: PrismaMainClient | undefined;
  prismaTeleMedicine: PrismaTeleMedicineClient | undefined;
  prismaFileNest: PrismaFileNestClient | undefined;
  prismaAiHub: PrismaAiHubClient | undefined;
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

export const prismaAiHub =
  globalForPrisma.prismaAiHub ??
  new PrismaAiHubClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaMain = prismaMain;
  globalForPrisma.prismaTeleMedicine = prismaTeleMedicine;
}
