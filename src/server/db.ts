import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? [/*"query",*/ "error", "warn"]
        : ["error"],
    transactionOptions: {
      maxWait: 20000, // Maximum time to wait for a transaction to start (default: 2000)
      timeout: 20000, // Maximum time for a transaction to complete (default: 5000)
    },
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
