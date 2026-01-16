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
    
    const { assessmentId } = request.query;
    if (!assessmentId || typeof assessmentId !== 'string') {
      return response.status(400).json({ error: 'Assessment ID required' });
    }

    // Get assessment and verify student is enrolled in the course
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        tenantId: user.tenantId,
      },
      include: {
        course: {
          include: {
            enrollments: {
              where: {
                studentId: user.userId,
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      return response.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.course.enrollments.length === 0) {
      return response.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Get or create attempt
    let attempt = await prisma.assessmentAttempt.findUnique({
      where: {
        assessmentId_studentId: {
          assessmentId: assessmentId,
          studentId: user.userId,
        },
      },
    });

    const assessmentWithStatus = withEffectiveClosed(assessment);

    // Create attempt if it doesn't exist and assessment is open
    if (!attempt && !assessmentWithStatus.effectiveClosed) {
      attempt = await prisma.assessmentAttempt.create({
        data: {
          tenantId: user.tenantId,
          assessmentId: assessmentId,
          studentId: user.userId,
          state: null,
        },
      });
    }

    return response.status(200).json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        effectiveClosed: assessmentWithStatus.effectiveClosed,
        pdfBlobUrl: assessment.pdfBlobUrl,
        pdfFileName: assessment.pdfFileName,
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
    console.error('Student attempt error:', error);
    return response.status(500).json({ error: 'Failed to fetch attempt' });
  }
}

