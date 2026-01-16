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
    const user = requireRole(session, ['TEACHER']);

    // Get courses where teacher is assigned
    const courseTeachers = await prisma.courseTeacher.findMany({
      where: {
        tenantId: user.tenantId,
        teacherId: user.userId,
      },
      include: {
        course: {
          include: {
            enrollments: true,
            assessments: true,
          },
        },
      },
    });

    const courses = courseTeachers.map(ct => ({
      id: ct.course.id,
      code: ct.course.code,
      title: ct.course.title,
      term: ct.course.term,
      status: ct.course.status,
      studentCount: ct.course.enrollments.length,
      assessmentCount: ct.course.assessments.length,
    }));

    return response.status(200).json({ courses });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher courses error:', error);
    return response.status(500).json({ error: 'Failed to fetch courses' });
  }
}

