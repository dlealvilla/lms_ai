import { PrismaClient, Role, UserStatus, CourseStatus, AssessmentStatus } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'wildmind-academy' },
    update: {},
    create: {
      name: 'Wildmind Academy',
      slug: 'wildmind-academy',
    },
  });
  console.log('✓ Tenant created:', tenant.name);

  // Create users
  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@wildmind.edu' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin User',
      email: 'admin@wildmind.edu',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'teacher@wildmind.edu' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Dr. Sarah Smith',
      email: 'teacher@wildmind.edu',
      role: Role.TEACHER,
      status: UserStatus.ACTIVE,
    },
  });

  const alice = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'alice@wildmind.edu' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Alice Johnson',
      email: 'alice@wildmind.edu',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const bob = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'bob@wildmind.edu' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Bob Williams',
      email: 'bob@wildmind.edu',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const charlie = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'charlie@wildmind.edu' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Charlie Brown',
      email: 'charlie@wildmind.edu',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('✓ Users created:', admin.name, teacher.name, alice.name, bob.name, charlie.name);

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-comp101-2026t1' },
    update: {},
    create: {
      id: 'course-comp101-2026t1',
      tenantId: tenant.id,
      code: 'COMP101',
      title: 'Introduction to Programming',
      term: '2026 T1',
      status: CourseStatus.CURRENT,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-writ201-2026t1' },
    update: {},
    create: {
      id: 'course-writ201-2026t1',
      tenantId: tenant.id,
      code: 'WRIT201',
      title: 'Academic Writing',
      term: '2026 T1',
      status: CourseStatus.CURRENT,
    },
  });

  console.log('✓ Courses created:', course1.code, course2.code);

  // Assign teacher to both courses
  await prisma.courseTeacher.upsert({
    where: { courseId_teacherId: { courseId: course1.id, teacherId: teacher.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      courseId: course1.id,
      teacherId: teacher.id,
    },
  });

  await prisma.courseTeacher.upsert({
    where: { courseId_teacherId: { courseId: course2.id, teacherId: teacher.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      courseId: course2.id,
      teacherId: teacher.id,
    },
  });

  console.log('✓ Teacher assigned to courses');

  // Enroll students in both courses
  const students = [alice, bob, charlie];
  for (const student of students) {
    await prisma.enrollment.upsert({
      where: { courseId_studentId: { courseId: course1.id, studentId: student.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        courseId: course1.id,
        studentId: student.id,
      },
    });

    await prisma.enrollment.upsert({
      where: { courseId_studentId: { courseId: course2.id, studentId: student.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        courseId: course2.id,
        studentId: student.id,
      },
    });
  }

  console.log('✓ Students enrolled');

  // Create assessments for course 1
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago

  const assessment1 = await prisma.assessment.upsert({
    where: { id: 'assessment-prog-1' },
    update: {},
    create: {
      id: 'assessment-prog-1',
      tenantId: tenant.id,
      courseId: course1.id,
      title: 'Programming Fundamentals Essay',
      descriptionText: 'Write a 500-word essay explaining the importance of programming fundamentals.',
      status: AssessmentStatus.OPEN,
      dueAt: futureDate,
      closeAtDue: true,
    },
  });

  const assessment2 = await prisma.assessment.upsert({
    where: { id: 'assessment-prog-2' },
    update: {},
    create: {
      id: 'assessment-prog-2',
      tenantId: tenant.id,
      courseId: course1.id,
      title: 'Algorithm Analysis',
      descriptionText: 'Analyze the time complexity of common sorting algorithms.',
      status: AssessmentStatus.OPEN,
      dueAt: futureDate,
      closeAtDue: false,
    },
  });

  const assessment3 = await prisma.assessment.upsert({
    where: { id: 'assessment-prog-3' },
    update: {},
    create: {
      id: 'assessment-prog-3',
      tenantId: tenant.id,
      courseId: course1.id,
      title: 'Code Review Report',
      descriptionText: 'Review and analyze the provided code samples.',
      status: AssessmentStatus.CLOSED,
      dueAt: pastDate,
      closeAtDue: true,
    },
  });

  // Create assessments for course 2
  const assessment4 = await prisma.assessment.upsert({
    where: { id: 'assessment-writ-1' },
    update: {},
    create: {
      id: 'assessment-writ-1',
      tenantId: tenant.id,
      courseId: course2.id,
      title: 'Argumentative Essay',
      descriptionText: 'Write a persuasive essay on a topic of your choice.',
      status: AssessmentStatus.OPEN,
      dueAt: futureDate,
      closeAtDue: true,
    },
  });

  const assessment5 = await prisma.assessment.upsert({
    where: { id: 'assessment-writ-2' },
    update: {},
    create: {
      id: 'assessment-writ-2',
      tenantId: tenant.id,
      courseId: course2.id,
      title: 'Literature Review',
      descriptionText: 'Conduct a literature review on an academic topic.',
      status: AssessmentStatus.OPEN,
      dueAt: null,
      closeAtDue: false,
    },
  });

  const assessment6 = await prisma.assessment.upsert({
    where: { id: 'assessment-writ-3' },
    update: {},
    create: {
      id: 'assessment-writ-3',
      tenantId: tenant.id,
      courseId: course2.id,
      title: 'Research Proposal',
      descriptionText: 'Draft a research proposal for your final project.',
      status: AssessmentStatus.CLOSED,
      dueAt: pastDate,
      closeAtDue: true,
    },
  });

  console.log('✓ Assessments created');

  // Create assessment attempts with sample state
  const sampleState = {
    assessmentId: assessment1.id,
    documentContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'My Programming Essay' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Programming is a fundamental skill in the modern world...',
            },
          ],
        },
      ],
    },
    chatHistory: [
      {
        id: 'msg_1',
        role: 'student',
        content: 'Can you help me improve my introduction?',
        createdAt: Date.now() - 3600000,
      },
      {
        id: 'msg_2',
        role: 'ai',
        content: 'Of course! Your introduction could benefit from a stronger hook. Consider starting with a compelling statistic or question about programming.',
        createdAt: Date.now() - 3500000,
      },
    ],
    insertions: [],
  };

  // Alice's attempts
  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: assessment1.id, studentId: alice.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      assessmentId: assessment1.id,
      studentId: alice.id,
      state: sampleState,
      lastSavedAt: new Date(),
    },
  });

  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: assessment3.id, studentId: alice.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      assessmentId: assessment3.id,
      studentId: alice.id,
      state: sampleState,
      lastSavedAt: pastDate,
      mark: 85,
      markedAt: new Date(),
      markedByTeacherId: teacher.id,
    },
  });

  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: assessment4.id, studentId: alice.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      assessmentId: assessment4.id,
      studentId: alice.id,
      state: {
        assessmentId: assessment4.id,
        documentContent: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Draft in progress...' }],
            },
          ],
        },
        chatHistory: [],
        insertions: [],
      },
      lastSavedAt: new Date(),
    },
  });

  // Bob's attempts
  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: assessment1.id, studentId: bob.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      assessmentId: assessment1.id,
      studentId: bob.id,
      state: sampleState,
      lastSavedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
  });

  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: assessment3.id, studentId: bob.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      assessmentId: assessment3.id,
      studentId: bob.id,
      state: sampleState,
      lastSavedAt: pastDate,
      mark: 72,
      markedAt: new Date(),
      markedByTeacherId: teacher.id,
    },
  });

  // Charlie's attempts
  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: assessment6.id, studentId: charlie.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      assessmentId: assessment6.id,
      studentId: charlie.id,
      state: sampleState,
      lastSavedAt: pastDate,
      mark: 90,
      markedAt: new Date(),
      markedByTeacherId: teacher.id,
    },
  });

  console.log('✓ Assessment attempts created with marks');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\nTest accounts:');
  console.log('  Student: alice@wildmind.edu, bob@wildmind.edu, charlie@wildmind.edu');
  console.log('  Teacher: teacher@wildmind.edu');
  console.log('  Admin: admin@wildmind.edu');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

