import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withEffectiveClosed } from '../../../../../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../../../../../lib/auth.js';

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
    
    const { studentId, assessmentId } = request.query;
    if (!studentId || typeof studentId !== 'string' || !assessmentId || typeof assessmentId !== 'string') {
      return response.status(400).json({ error: 'Student ID and Assessment ID required' });
    }

    // Get assessment and verify teacher is assigned to the course
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        tenantId: user.tenantId,
      },
      include: {
        course: {
          include: {
            teachers: {
              where: {
                teacherId: user.userId,
              },
            },
            enrollments: {
              where: {
                studentId: studentId,
              },
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      return response.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.course.teachers.length === 0) {
      return response.status(403).json({ error: 'Not assigned to this course' });
    }

    if (assessment.course.enrollments.length === 0) {
      return response.status(404).json({ error: 'Student not enrolled in this course' });
    }

    const student = assessment.course.enrollments[0].student;

    // Get student's attempt
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: {
        assessmentId_studentId: {
          assessmentId: assessmentId,
          studentId: studentId,
        },
      },
    });

    const assessmentWithStatus = withEffectiveClosed(assessment);

    return response.status(200).json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        effectiveClosed: assessmentWithStatus.effectiveClosed,
        pdfBlobUrl: assessment.pdfBlobUrl,
        pdfFileName: assessment.pdfFileName,
      },
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
      attempt: attempt ? {
        id: attempt.id,
        state: attempt.state,
        mark: attempt.mark,
        lastSavedAt: attempt.lastSavedAt?.toISOString() || null,
      } : null,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher view attempt error:', error);
    return response.status(500).json({ error: 'Failed to fetch attempt' });
  }
}

