import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withEffectiveClosed, isEffectivelyClosed } from '../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../lib/auth.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['STUDENT']);
    
    // Parse the path
    const pathParam = request.query.path;
    const pathParts = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];
    const path = '/' + pathParts.join('/');

    // Route: GET /api/student/courses
    if (path === '/courses' && request.method === 'GET') {
      return handleGetCourses(user, response);
    }

    // Route: GET /api/student/courses/:courseId/assessments
    const courseAssessmentsMatch = path.match(/^\/courses\/([^\/]+)\/assessments$/);
    if (courseAssessmentsMatch && request.method === 'GET') {
      return handleGetCourseAssessments(user, courseAssessmentsMatch[1], response);
    }

    // Route: GET /api/student/assessments/:assessmentId/attempt
    const attemptMatch = path.match(/^\/assessments\/([^\/]+)\/attempt$/);
    if (attemptMatch && request.method === 'GET') {
      return handleGetAttempt(user, attemptMatch[1], response);
    }

    // Route: POST /api/student/assessments/:assessmentId/attempt/autosave
    const autosaveMatch = path.match(/^\/assessments\/([^\/]+)\/attempt\/autosave$/);
    if (autosaveMatch && request.method === 'POST') {
      return handleAutosave(user, autosaveMatch[1], request, response);
    }

    return response.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Student API error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/student/courses
async function handleGetCourses(
  user: { userId: string; tenantId: string },
  response: VercelResponse
) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      tenantId: user.tenantId,
      studentId: user.userId,
    },
    include: {
      course: true,
    },
  });

  const courses = enrollments.map(e => ({
    id: e.course.id,
    code: e.course.code,
    title: e.course.title,
    term: e.course.term,
    status: e.course.status,
  }));

  return response.status(200).json({ courses });
}

// GET /api/student/courses/:courseId/assessments
async function handleGetCourseAssessments(
  user: { userId: string; tenantId: string },
  courseId: string,
  response: VercelResponse
) {
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
}

// GET /api/student/assessments/:assessmentId/attempt
async function handleGetAttempt(
  user: { userId: string; tenantId: string },
  assessmentId: string,
  response: VercelResponse
) {
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

  let attempt = await prisma.assessmentAttempt.findUnique({
    where: {
      assessmentId_studentId: {
        assessmentId: assessmentId,
        studentId: user.userId,
      },
    },
  });

  const assessmentWithStatus = withEffectiveClosed(assessment);

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
}

// POST /api/student/assessments/:assessmentId/attempt/autosave
async function handleAutosave(
  user: { userId: string; tenantId: string },
  assessmentId: string,
  request: VercelRequest,
  response: VercelResponse
) {
  const { state } = request.body;
  if (!state) {
    return response.status(400).json({ error: 'State is required' });
  }

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

  if (isEffectivelyClosed(assessment)) {
    return response.status(403).json({ 
      error: 'Assessment is closed',
      effectiveClosed: true,
      message: 'Cannot save to a closed assessment',
    });
  }

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
}

