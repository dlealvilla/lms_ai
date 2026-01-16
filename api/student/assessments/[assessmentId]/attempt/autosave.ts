import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, isEffectivelyClosed } from '../../../../lib/db';
import { getSessionFromRequest, requireRole, AuthError } from '../../../../lib/auth';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['STUDENT']);
    
    const { assessmentId } = request.query;
    if (!assessmentId || typeof assessmentId !== 'string') {
      return response.status(400).json({ error: 'Assessment ID required' });
    }

    const { state } = request.body;
    if (!state) {
      return response.status(400).json({ error: 'State is required' });
    }

    // Get assessment and verify enrollment
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

    // Check if assessment is closed
    if (isEffectivelyClosed(assessment)) {
      return response.status(403).json({ 
        error: 'Assessment is closed',
        effectiveClosed: true,
        message: 'Cannot save to a closed assessment',
      });
    }

    // Update or create attempt
    const attempt = await prisma.assessmentAttempt.upsert({
      where: {
        assessmentId_studentId: {
          assessmentId: assessmentId,
          studentId: user.userId,
        },
      },
      update: {
        state: state,
        lastSavedAt: new Date(),
        version: { increment: 1 },
      },
      create: {
        tenantId: user.tenantId,
        assessmentId: assessmentId,
        studentId: user.userId,
        state: state,
        lastSavedAt: new Date(),
      },
    });

    return response.status(200).json({
      success: true,
      lastSavedAt: attempt.lastSavedAt.toISOString(),
      version: attempt.version,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Student autosave error:', error);
    return response.status(500).json({ error: 'Failed to save' });
  }
}

