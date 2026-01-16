import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../lib/auth.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['ADMIN']);

    const [userCount, courseCount, assessmentCount, attemptCount] = await Promise.all([
      prisma.user.count({
        where: { tenantId: user.tenantId },
      }),
      prisma.course.count({
        where: { tenantId: user.tenantId },
      }),
      prisma.assessment.count({
        where: { tenantId: user.tenantId },
      }),
      prisma.assessmentAttempt.count({
        where: { tenantId: user.tenantId },
      }),
    ]);

    return response.status(200).json({
      userCount,
      courseCount,
      assessmentCount,
      attemptCount,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Admin stats error:', error);
    return response.status(500).json({ error: 'Failed to fetch stats' });
  }
}

