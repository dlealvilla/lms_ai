import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withEffectiveClosed } from '../../../../lib/db';
import { getSessionFromRequest, requireRole, AuthError } from '../../../../lib/auth';

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
    
    const { courseId, studentId } = request.query;
    if (!courseId || typeof courseId !== 'string' || !studentId || typeof studentId !== 'string') {
      return response.status(400).json({ error: 'Course ID and Student ID required' });
    }

    // Verify teacher is assigned to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        tenantId: user.tenantId,
        courseId: courseId,
        teacherId: user.userId,
      },
      include: {
        course: true,
      },
    });

    if (!courseTeacher) {
      return response.status(403).json({ error: 'Not assigned to this course' });
    }

    // Verify student is enrolled
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        tenantId: user.tenantId,
        courseId: courseId,
        studentId: studentId,
      },
      include: {
        student: true,
      },
    });

    if (!enrollment) {
      return response.status(404).json({ error: 'Student not enrolled in this course' });
    }

    // Get all assessments for this course with student's attempts
    const assessments = await prisma.assessment.findMany({
      where: {
        tenantId: user.tenantId,
        courseId: courseId,
      },
      include: {
        attempts: {
          where: {
            studentId: studentId,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const studentAttempts = assessments.map((assessment) => {
      const withClosed = withEffectiveClosed(assessment);
      const attempt = assessment.attempts[0] || null;

      return {
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        effectiveClosed: withClosed.effectiveClosed,
        hasAttempt: !!attempt,
        lastSavedAt: attempt?.lastSavedAt?.toISOString() || null,
        mark: attempt?.mark || null,
      };
    });

    return response.status(200).json({
      course: {
        id: courseTeacher.course.id,
        code: courseTeacher.course.code,
        title: courseTeacher.course.title,
      },
      student: {
        id: enrollment.student.id,
        name: enrollment.student.name,
        email: enrollment.student.email,
        attempts: studentAttempts,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher student error:', error);
    return response.status(500).json({ error: 'Failed to fetch student details' });
  }
}

