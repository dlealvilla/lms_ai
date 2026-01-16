import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../../../../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../../../../../lib/auth.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'PATCH') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['TEACHER']);
    
    const { studentId, assessmentId } = request.query;
    if (!studentId || typeof studentId !== 'string' || !assessmentId || typeof assessmentId !== 'string') {
      return response.status(400).json({ error: 'Student ID and Assessment ID required' });
    }

    const { mark } = request.body;
    
    // Validate mark
    if (mark === undefined || mark === null) {
      return response.status(400).json({ error: 'Mark is required' });
    }

    const markValue = parseInt(mark, 10);
    if (isNaN(markValue) || markValue < 0 || markValue > 100) {
      return response.status(400).json({ error: 'Mark must be an integer between 0 and 100' });
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

    // Get or create attempt and set mark
    const attempt = await prisma.assessmentAttempt.upsert({
      where: {
        assessmentId_studentId: {
          assessmentId: assessmentId,
          studentId: studentId,
        },
      },
      update: {
        mark: markValue,
        markedAt: new Date(),
        markedByTeacherId: user.userId,
      },
      create: {
        tenantId: user.tenantId,
        assessmentId: assessmentId,
        studentId: studentId,
        mark: markValue,
        markedAt: new Date(),
        markedByTeacherId: user.userId,
      },
    });

    return response.status(200).json({
      success: true,
      mark: attempt.mark,
      markedAt: attempt.markedAt?.toISOString(),
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher mark error:', error);
    return response.status(500).json({ error: 'Failed to save mark' });
  }
}

