import { PrismaClient, Assessment } from '../../src/generated/prisma/index.js';

// Singleton PrismaClient for serverless functions
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
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

