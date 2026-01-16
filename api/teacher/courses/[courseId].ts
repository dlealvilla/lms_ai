import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withEffectiveClosed } from '../../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../../lib/auth.js';

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
    
    const { courseId } = request.query;
    if (!courseId || typeof courseId !== 'string') {
      return response.status(400).json({ error: 'Course ID required' });
    }

    // Verify teacher is assigned to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        tenantId: user.tenantId,
        courseId: courseId,
        teacherId: user.userId,
      },
      include: {
        course: {
          include: {
            enrollments: {
              include: {
                student: true,
              },
            },
            assessments: {
              include: {
                attempts: true,
              },
            },
          },
        },
      },
    });

    if (!courseTeacher) {
      return response.status(403).json({ error: 'Not assigned to this course' });
    }

    const course = courseTeacher.course;

    // Build student list with attempt summaries
    const students = await Promise.all(
      course.enrollments.map(async (enrollment) => {
        const studentAttempts = await prisma.assessmentAttempt.findMany({
          where: {
            tenantId: user.tenantId,
            studentId: enrollment.studentId,
            assessment: {
              courseId: courseId,
            },
          },
          orderBy: {
            lastSavedAt: 'desc',
          },
        });

        const lastActive = studentAttempts[0]?.lastSavedAt || null;

        return {
          id: enrollment.student.id,
          name: enrollment.student.name,
          email: enrollment.student.email,
          attemptCount: studentAttempts.length,
          lastActiveAt: lastActive?.toISOString() || null,
        };
      })
    );

    // Build assessment list with stats
    const assessments = course.assessments.map((assessment) => {
      const withClosed = withEffectiveClosed(assessment);
      const markedCount = assessment.attempts.filter(a => a.mark !== null).length;

      return {
        id: assessment.id,
        title: assessment.title,
        status: assessment.status,
        effectiveClosed: withClosed.effectiveClosed,
        dueAt: assessment.dueAt?.toISOString() || null,
        closeAtDue: assessment.closeAtDue,
        pdfBlobUrl: assessment.pdfBlobUrl,
        pdfFileName: assessment.pdfFileName,
        attemptCount: assessment.attempts.length,
        markedCount: markedCount,
      };
    });

    return response.status(200).json({
      id: course.id,
      code: course.code,
      title: course.title,
      term: course.term,
      students,
      assessments,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher course error:', error);
    return response.status(500).json({ error: 'Failed to fetch course details' });
  }
}

