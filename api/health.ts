import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withDbRetry } from './lib/db.js';

/**
 * Lightweight health check that touches the database.
 * Useful for keep-warm pings against Neon free-tier cold starts.
 * GET /api/health
 */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const started = Date.now();
  try {
    await withDbRetry(
      () => prisma.$queryRaw`SELECT 1`,
      { attempts: 3, baseDelayMs: 300, label: 'health' },
    );
    return response.status(200).json({
      ok: true,
      db: 'up',
      latencyMs: Date.now() - started,
    });
  } catch (error: any) {
    console.error('Health check failed:', error?.message || error);
    return response.status(503).json({
      ok: false,
      db: 'down',
      latencyMs: Date.now() - started,
      error: 'Database unreachable',
    });
  }
}
