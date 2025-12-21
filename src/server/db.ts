import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { env } from "~/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ??
  new Pool({ connectionString: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

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
