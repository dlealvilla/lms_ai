import { PrismaClient, Assessment } from '../../src/generated/prisma/index.js';

// Singleton PrismaClient for serverless functions
declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  // Encourage Neon pooled connections to fail fast and retry rather than hang
  // when the free-tier compute is cold. DATABASE_URL may already include params;
  // we only add connect_timeout if missing.
  const rawUrl = process.env.DATABASE_URL;
  if (rawUrl && !/[?&]connect_timeout=/.test(rawUrl)) {
    const sep = rawUrl.includes('?') ? '&' : '?';
    process.env.DATABASE_URL = `${rawUrl}${sep}connect_timeout=15`;
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/** Retry a DB operation with exponential backoff (helps Neon cold starts). */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  options: { attempts?: number; baseDelayMs?: number; label?: string } = {},
): Promise<T> {
  const attempts = options.attempts ?? 4;
  const baseDelayMs = options.baseDelayMs ?? 400;
  const label = options.label ?? 'db';

  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const message = String(error?.message || error || '');
      const transient =
        /Can't reach database server|P1001|P1002|P1017|ECONNREFUSED|ETIMEDOUT|timed out|connection/i.test(
          message,
        );
      if (!transient || i === attempts - 1) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, i);
      console.warn(
        `[${label}] transient DB error (attempt ${i + 1}/${attempts}), retrying in ${delay}ms:`,
        message,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// Utility: Compute effective closed status for an assessment
export function isEffectivelyClosed(assessment: Pick<Assessment, 'status' | 'closeAtDue' | 'dueAt'>): boolean {
  // Explicitly closed
  if (assessment.status === 'CLOSED') {
    return true;
  }
  
  // Auto-close if closeAtDue is true and dueAt has passed
  if (assessment.closeAtDue && assessment.dueAt) {
    return new Date(assessment.dueAt) <= new Date();
  }
  
  return false;
}

// Utility: Add effectiveClosed to assessment object
export function withEffectiveClosed<T extends Pick<Assessment, 'status' | 'closeAtDue' | 'dueAt'>>(
  assessment: T
): T & { effectiveClosed: boolean } {
  return {
    ...assessment,
    effectiveClosed: isEffectivelyClosed(assessment),
  };
}
