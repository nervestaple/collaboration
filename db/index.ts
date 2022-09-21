import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalThis = global as any as { prisma: PrismaClient };

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma as PrismaClient;
