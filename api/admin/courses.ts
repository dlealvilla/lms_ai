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

    const courses = await prisma.course.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        title: true,
        term: true,
        status: true,
      },
    });

    return response.status(200).json({ courses });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Admin courses error:', error);
    return response.status(500).json({ error: 'Failed to fetch courses' });
  }
}

