import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../lib/auth.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['ADMIN']);
    
    // Parse the path
    const pathParam = request.query.path;
    const pathParts = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];
    const path = '/' + pathParts.join('/');

    // Route: GET /api/admin/users
    if (path === '/users' && request.method === 'GET') {
      return handleGetUsers(user, response);
    }

    // Route: GET /api/admin/courses
    if (path === '/courses' && request.method === 'GET') {
      return handleGetCourses(user, response);
    }

    // Route: GET /api/admin/stats
    if (path === '/stats' && request.method === 'GET') {
      return handleGetStats(user, response);
    }

    return response.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Admin API error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/admin/users
async function handleGetUsers(
  user: { tenantId: string },
  response: VercelResponse
) {
  const users = await prisma.user.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return response.status(200).json({ users });
}

// GET /api/admin/courses
async function handleGetCourses(
  user: { tenantId: string },
  response: VercelResponse
) {
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
}

// GET /api/admin/stats
async function handleGetStats(
  user: { tenantId: string },
  response: VercelResponse
) {
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
}

