/**
 * Prisma client singleton for server-side database access in App Router.
 * This file exists to ensure the database layer shares one Prisma client instance in development.
 * It interacts with prisma/schema.prisma and the repository files under src/database/repositories.
 */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Returns the shared Prisma client used by the repository layer.
 */
export function getPrismaClient(): PrismaClient {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  return global.prisma;
}
