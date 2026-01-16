import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withEffectiveClosed } from '../../../lib/db';
import { getSessionFromRequest, requireRole, AuthError } from '../../../lib/auth';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['STUDENT']);
    
    const { courseId } = request.query;
    if (!courseId || typeof courseId !== 'string') {
      return response.status(400).json({ error: 'Course ID required' });
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        tenantId: user.tenantId,
        courseId: courseId,
        studentId: user.userId,
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      return response.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Get assessments for this course
    const assessments = await prisma.assessment.findMany({
      where: {
        tenantId: user.tenantId,
        courseId: courseId,
      },
      include: {
        attempts: {
          where: {
            studentId: user.userId,
          },
          select: {
            lastSavedAt: true,
            mark: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const assessmentsWithStatus = assessments.map(a => {
      const withClosed = withEffectiveClosed(a);
      const attempt = a.attempts[0] || null;
      
      return {
        id: a.id,
        title: a.title,
        status: a.status,
        effectiveClosed: withClosed.effectiveClosed,
        dueAt: a.dueAt?.toISOString() || null,
        pdfBlobUrl: a.pdfBlobUrl,
        pdfFileName: a.pdfFileName,
        attempt: attempt ? {
          lastSavedAt: attempt.lastSavedAt?.toISOString() || null,
          mark: attempt.mark,
        } : null,
      };
    });

    return response.status(200).json({
      id: enrollment.course.id,
      code: enrollment.course.code,
      title: enrollment.course.title,
      term: enrollment.course.term,
      assessments: assessmentsWithStatus,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Student course assessments error:', error);
    return response.status(500).json({ error: 'Failed to fetch course assessments' });
  }
}

