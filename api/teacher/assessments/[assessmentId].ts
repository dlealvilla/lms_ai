import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../../lib/auth.js';

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
    
    const { assessmentId } = request.query;
    if (!assessmentId || typeof assessmentId !== 'string') {
      return response.status(400).json({ error: 'Assessment ID required' });
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

    // Update assessment
    const { status, dueAt, closeAtDue, title, descriptionText } = request.body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status !== undefined) {
      if (!['OPEN', 'CLOSED'].includes(status)) {
        return response.status(400).json({ error: 'Invalid status' });
      }
      
      // Log status change
      if (status !== assessment.status) {
        await prisma.assessmentStatusHistory.create({
          data: {
            tenantId: user.tenantId,
            assessmentId: assessmentId,
            changedByUserId: user.userId,
            fromStatus: assessment.status,
            toStatus: status,
            reason: 'Manual status change by teacher',
          },
        });
      }
      
      updateData.status = status;
    }

    if (dueAt !== undefined) {
      updateData.dueAt = dueAt ? new Date(dueAt) : null;
    }

    if (closeAtDue !== undefined) {
      updateData.closeAtDue = closeAtDue;
    }

    if (title !== undefined) {
      updateData.title = title;
    }

    if (descriptionText !== undefined) {
      updateData.descriptionText = descriptionText;
    }

    const updated = await prisma.assessment.update({
      where: { id: assessmentId },
      data: updateData,
    });

    return response.status(200).json({
      id: updated.id,
      title: updated.title,
      status: updated.status,
      dueAt: updated.dueAt?.toISOString() || null,
      closeAtDue: updated.closeAtDue,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher assessment update error:', error);
    return response.status(500).json({ error: 'Failed to update assessment' });
  }
}

