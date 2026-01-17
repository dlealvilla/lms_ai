import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, withEffectiveClosed } from '../lib/db.js';
import { getSessionFromRequest, requireRole, AuthError } from '../lib/auth.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const session = getSessionFromRequest(request);
    const user = requireRole(session, ['TEACHER']);
    
    // Parse the path
    const pathParam = request.query.path;
    const pathParts = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];
    const path = '/' + pathParts.join('/');

    // Route: GET /api/teacher/courses
    if (path === '/courses' && request.method === 'GET') {
      return handleGetCourses(user, response);
    }

    // Route: GET /api/teacher/courses/:courseId
    const courseMatch = path.match(/^\/courses\/([^\/]+)$/);
    if (courseMatch && request.method === 'GET') {
      return handleGetCourse(user, courseMatch[1], response);
    }

    // Route: GET /api/teacher/courses/:courseId/students/:studentId
    const studentMatch = path.match(/^\/courses\/([^\/]+)\/students\/([^\/]+)$/);
    if (studentMatch && request.method === 'GET') {
      return handleGetStudent(user, studentMatch[1], studentMatch[2], response);
    }

    // Route: PATCH /api/teacher/assessments/:assessmentId
    const assessmentPatchMatch = path.match(/^\/assessments\/([^\/]+)$/);
    if (assessmentPatchMatch && request.method === 'PATCH') {
      return handleUpdateAssessment(user, assessmentPatchMatch[1], request, response);
    }

    // Route: GET /api/teacher/students/:studentId/assessments/:assessmentId/attempt
    const attemptMatch = path.match(/^\/students\/([^\/]+)\/assessments\/([^\/]+)\/attempt$/);
    if (attemptMatch && request.method === 'GET') {
      return handleGetStudentAttempt(user, attemptMatch[1], attemptMatch[2], response);
    }

    // Route: PATCH /api/teacher/students/:studentId/assessments/:assessmentId/mark
    const markMatch = path.match(/^\/students\/([^\/]+)\/assessments\/([^\/]+)\/mark$/);
    if (markMatch && request.method === 'PATCH') {
      return handleSetMark(user, markMatch[1], markMatch[2], request, response);
    }

    return response.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return response.status(error.statusCode).json({ error: error.message });
    }
    console.error('Teacher API error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/teacher/courses
async function handleGetCourses(
  user: { userId: string; tenantId: string },
  response: VercelResponse
) {
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
}

// GET /api/teacher/courses/:courseId
async function handleGetCourse(
  user: { userId: string; tenantId: string },
  courseId: string,
  response: VercelResponse
) {
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
}

// GET /api/teacher/courses/:courseId/students/:studentId
async function handleGetStudent(
  user: { userId: string; tenantId: string },
  courseId: string,
  studentId: string,
  response: VercelResponse
) {
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
}

// PATCH /api/teacher/assessments/:assessmentId
async function handleUpdateAssessment(
  user: { userId: string; tenantId: string },
  assessmentId: string,
  request: VercelRequest,
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

  const { status, dueAt, closeAtDue, title, descriptionText } = request.body;

  const updateData: any = {
    updatedAt: new Date(),
  };

  if (status !== undefined) {
    if (!['OPEN', 'CLOSED'].includes(status)) {
      return response.status(400).json({ error: 'Invalid status' });
    }
    
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
}

// GET /api/teacher/students/:studentId/assessments/:assessmentId/attempt
async function handleGetStudentAttempt(
  user: { userId: string; tenantId: string },
  studentId: string,
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
}

// PATCH /api/teacher/students/:studentId/assessments/:assessmentId/mark
async function handleSetMark(
  user: { userId: string; tenantId: string },
  studentId: string,
  assessmentId: string,
  request: VercelRequest,
  response: VercelResponse
) {
  const { mark } = request.body;
  
  if (mark === undefined || mark === null) {
    return response.status(400).json({ error: 'Mark is required' });
  }

  const markValue = parseInt(mark, 10);
  if (isNaN(markValue) || markValue < 0 || markValue > 100) {
    return response.status(400).json({ error: 'Mark must be an integer between 0 and 100' });
  }

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
}

