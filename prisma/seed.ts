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

  // Create History course (PAST - closed)
  const histCourse = await prisma.course.upsert({
    where: { id: 'course-hist201-2025t2' },
    update: {},
    create: {
      id: 'course-hist201-2025t2',
      tenantId: tenant.id,
      code: 'HIST201',
      title: 'Modern World History',
      term: '2025 T2',
      status: CourseStatus.PAST,
    },
  });

  console.log('✓ Courses created:', course1.code, course2.code, histCourse.code);

  // Assign teacher to all courses
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

  await prisma.courseTeacher.upsert({
    where: { courseId_teacherId: { courseId: histCourse.id, teacherId: teacher.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      courseId: histCourse.id,
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

    // Enroll in History course
    await prisma.enrollment.upsert({
      where: { courseId_studentId: { courseId: histCourse.id, studentId: student.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        courseId: histCourse.id,
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

  // Create History assessment - WW2 Essay (CLOSED - all students submitted)
  const histAssessment = await prisma.assessment.upsert({
    where: { id: 'assessment-hist-1' },
    update: {},
    create: {
      id: 'assessment-hist-1',
      tenantId: tenant.id,
      courseId: histCourse.id,
      title: 'Assessment 1 — Causes of World War II',
      descriptionText: 'To what extent was World War II caused by the Treaty of Versailles? Write an essay of 1300-1600 words analyzing the causes of World War II.',
      status: AssessmentStatus.CLOSED,
      dueAt: new Date('2025-12-01'),
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

  // ============================================
  // HISTORY ASSESSMENT SUBMISSIONS (WW2 Essay)
  // ============================================

  // STRONG STUDENT OUTPUT - Alice Johnson
  const aliceHistoryState = {
    assessmentId: histAssessment.id,
    documentContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'To What Extent Was World War II Caused by the Treaty of Versailles?' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'World War II emerged from a complex interplay of structural weaknesses, ideological radicalisation, and geopolitical miscalculation. Although the Treaty of Versailles generated deep resentment and contributed to economic and political instability within Germany, it did not make war inevitable. Rather, the Treaty created conditions that were exploited by expansionist leaders and amplified by the failure of collective security. To a significant extent, Versailles helped shape an environment conducive to conflict, but the outbreak of war ultimately depended on the actions of totalitarian regimes and the inability of other powers to deter aggression.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The Treaty of Versailles imposed territorial losses, military restrictions, and substantial reparations on Germany. Its war guilt clause further delegitimised the post-war political order by framing Germany as uniquely responsible for World War I. These terms undermined the Weimar Republic by associating democratic governance with national humiliation. Economic pressure, coupled with political polarisation, weakened institutional stability and contributed to a climate in which radical solutions gained appeal. In this sense, Versailles functioned as a long-term structural cause: it destabilised German society and helped erode confidence in moderate politics.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Economic turmoil reinforced these dynamics. Hyperinflation in 1923 and later economic hardship during the Great Depression increased unemployment and social dislocation, making extremist politics more plausible to broader segments of the population. However, economic crisis alone does not automatically produce war. The significance of Versailles lies not simply in economic damage, but in how economic instability interacted with grievance politics. The Treaty\'s symbolism and its constraints became tools through which extremist movements framed national recovery as requiring the rejection of the post-war settlement.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The rise of totalitarian regimes converted grievance and instability into expansionist policy. Adolf Hitler\'s agenda centred on revising Versailles, acquiring Lebensraum, and rebuilding German military power. German foreign policy between 1933 and 1939 escalated through deliberate steps, including the remilitarisation of the Rhineland, the Anschluss with Austria, and the dismantling of Czechoslovakia following the Munich Agreement. These actions revealed not only dissatisfaction with Versailles but also a broader ideological commitment to militarism and territorial expansion. Similar patterns appeared elsewhere: Mussolini\'s invasion of Ethiopia and Japan\'s expansion in Manchuria demonstrated the global collapse of restraint and the willingness of revisionist powers to pursue imperial goals.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Collective security mechanisms failed to contain this pattern. The League of Nations proved ineffective in responding to aggression, partly due to a lack of enforcement capability and the reluctance of major powers to act decisively. Britain\'s policy of appeasement, often criticised in hindsight, reflected war fatigue, economic constraints, and the belief that some Treaty terms had been overly punitive. Yet appeasement reduced deterrence and signalled that incremental violations would not be met with force. As a result, aggressive regimes were emboldened and the international system\'s capacity to prevent escalation deteriorated further.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Ultimately, the invasion of Poland in 1939 served as the immediate trigger for war. While Versailles contributed to the longer-term conditions that shaped Europe\'s instability, the outbreak of World War II depended on contingent decisions: the strategic calculations of Hitler\'s regime, the weakness of international enforcement, and the failure of diplomacy to contain escalating revisionism. Historians such as A.J.P. Taylor have argued that Hitler exploited opportunities within a permissive international environment rather than following an entirely predetermined plan, suggesting that diplomacy and miscalculation were as important as ideological intent. This perspective supports the view that Versailles mattered, but it did not alone determine the outcome.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'In conclusion, the Treaty of Versailles was an important contributing factor to World War II because it generated instability and grievance that undermined the post-war settlement. However, it was not a sufficient cause. The war emerged from the interaction of punitive peace, economic crisis, totalitarian expansionism, and international inaction. Versailles helped set the stage, but it was the choices of aggressive regimes—and the failure of others to resist them—that transformed conditions into catastrophe.' }],
        },
      ],
    },
    chatHistory: [],
    insertions: [],
  };

  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: histAssessment.id, studentId: alice.id } },
    update: {},
    create: {
      id: 'ATT-2026-02-15-0001',
      tenantId: tenant.id,
      assessmentId: histAssessment.id,
      studentId: alice.id,
      state: aliceHistoryState,
      lastSavedAt: new Date('2025-12-01'),
      submittedAt: new Date('2025-12-01'),
      mark: 92,
      markedAt: new Date('2025-12-05'),
      markedByTeacherId: teacher.id,
    },
  });

  // WEAK STUDENT OUTPUT - Bob Williams
  const bobHistoryState = {
    assessmentId: histAssessment.id,
    documentContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'The Causes of World War II' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'World War II was caused by many different factors. One important cause was the Treaty of Versailles, which punished Germany after World War I. The treaty made Germany pay reparations and limited its military, which made Germany angry and unhappy.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hitler came to power in Germany and wanted to undo the Treaty of Versailles. He rebuilt the military and expanded Germany\'s territory. Mussolini also wanted to expand Italy. The League of Nations failed to stop these countries. Appeasement was another cause because Britain and France allowed Germany to take more land.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The invasion of Poland in 1939 started the war. Overall, the Treaty of Versailles was an important cause because it treated Germany unfairly. However, other factors such as Hitler\'s actions and appeasement also played a role. Therefore, the war was caused by a combination of different factors.' }],
        },
      ],
    },
    chatHistory: [],
    insertions: [],
  };

  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: histAssessment.id, studentId: bob.id } },
    update: {},
    create: {
      id: 'ATT-2026-02-15-0002',
      tenantId: tenant.id,
      assessmentId: histAssessment.id,
      studentId: bob.id,
      state: bobHistoryState,
      lastSavedAt: new Date('2025-12-01'),
      submittedAt: new Date('2025-12-01'),
      mark: 58,
      markedAt: new Date('2025-12-05'),
      markedByTeacherId: teacher.id,
    },
  });

  // INTERMEDIATE STUDENT OUTPUT - Charlie Brown
  const charlieHistoryState = {
    assessmentId: histAssessment.id,
    documentContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'To What Extent Did the Treaty of Versailles Cause World War II?' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'World War II was the result of several interconnected causes. The Treaty of Versailles played a significant role by weakening Germany politically and economically after World War I. However, it was not the only cause. The rise of Hitler, the failure of the League of Nations, and the policy of appeasement also contributed to the outbreak of war. While the Treaty created resentment and instability, the actions of leaders in the 1930s ultimately determined whether Europe would return to conflict.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The Treaty of Versailles imposed heavy reparations on Germany and limited its military. The war guilt clause also damaged national pride and led many Germans to feel that they had been treated unfairly. These conditions weakened the Weimar Republic and contributed to political instability. Economic problems, including hyperinflation and later the effects of the Great Depression, increased dissatisfaction among the population. As a result, extremist parties gained support.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Adolf Hitler used anger toward the Treaty as part of his political message. He promised to restore Germany\'s strength and overturn the restrictions imposed in 1919. After coming to power, he rebuilt the military and began expanding Germany\'s territory. Key events such as the remilitarisation of the Rhineland and the Anschluss with Austria showed that Germany was willing to challenge the post-war settlement. However, these actions were not caused by the Treaty alone. They were also influenced by Nazi ideology and Hitler\'s personal ambitions.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The League of Nations failed to prevent aggression during the 1930s. It was unable to effectively respond to events such as Japan\'s expansion in Manchuria and Italy\'s invasion of Ethiopia. Britain and France followed a policy of appeasement, hoping to avoid another major war. The Munich Agreement in 1938 allowed Germany to take control of part of Czechoslovakia. Although appeasement was intended to preserve peace, it encouraged further expansion.' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'In conclusion, the Treaty of Versailles was an important factor in causing World War II because it created economic hardship and resentment in Germany. However, it did not make war inevitable. The rise of Hitler, aggressive expansion, and the weakness of international responses were also crucial. Therefore, the Treaty was a significant cause, but it must be considered alongside other political and ideological factors to fully understand why the war occurred.' }],
        },
      ],
    },
    chatHistory: [],
    insertions: [],
  };

  await prisma.assessmentAttempt.upsert({
    where: { assessmentId_studentId: { assessmentId: histAssessment.id, studentId: charlie.id } },
    update: {},
    create: {
      id: 'ATT-2026-02-15-0003',
      tenantId: tenant.id,
      assessmentId: histAssessment.id,
      studentId: charlie.id,
      state: charlieHistoryState,
      lastSavedAt: new Date('2025-12-01'),
      submittedAt: new Date('2025-12-01'),
      mark: 75,
      markedAt: new Date('2025-12-05'),
      markedByTeacherId: teacher.id,
    },
  });

  console.log('✓ History assessment submissions created (WW2 Essay)');
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

