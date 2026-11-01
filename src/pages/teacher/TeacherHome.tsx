import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardCheck, Inbox } from 'lucide-react';
import { LibraryShell, CourseShelf, type ShelfCourse } from '@/components/bookshelf';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { getAuthHeaders, useAuth } from '../../lib/auth/AuthContext';
import { spineColor } from '@/lib/bookshelf/spineColors';

interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  status: 'CURRENT' | 'PAST';
  studentCount: number;
  assessmentCount: number;
}

type QueueItem = {
  key: string;
  kind: 'mark' | 'due' | 'activity';
  courseId: string;
  courseCode: string;
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
};

function greetingForHour(h: number) {
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDue(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function TeacherHome() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/teacher/courses', { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        if (cancelled) return;
        const list: Course[] = data.courses || [];
        setCourses(list);

        const current = list.filter((c) => c.status === 'CURRENT');
        const details = await Promise.all(
          current.slice(0, 6).map(async (c) => {
            try {
              const r = await fetch(`/api/teacher/courses/${c.id}`, { headers: getAuthHeaders() });
              if (!r.ok) return null;
              const body = await r.json();
              return { course: c, body };
            } catch {
              return null;
            }
          }),
        );
        if (cancelled) return;

        const needsMark: QueueItem[] = [];
        const upcoming: QueueItem[] = [];
        const activity: QueueItem[] = [];

        for (const row of details) {
          if (!row) continue;
          const { course, body } = row;
          for (const a of body.assessments || []) {
            const unmarked = Math.max(0, (a.attemptCount || 0) - (a.markedCount || 0));
            if (unmarked > 0) {
              needsMark.push({
                key: `mark-${a.id}`,
                kind: 'mark',
                courseId: course.id,
                courseCode: course.code,
                title: a.title,
                subtitle: `${unmarked} awaiting mark · ${course.code}`,
                href: `/teacher/courses/${course.id}`,
                meta: `${a.markedCount || 0}/${a.attemptCount || 0}`,
              });
            }
            if (a.dueAt && !a.effectiveClosed) {
              upcoming.push({
                key: `due-${a.id}`,
                kind: 'due',
                courseId: course.id,
                courseCode: course.code,
                title: a.title,
                subtitle: `Due ${formatDue(a.dueAt)} · ${course.code}`,
                href: `/teacher/courses/${course.id}`,
                meta: formatDue(a.dueAt) || undefined,
              });
            }
          }
          for (const s of (body.students || []).slice(0, 4)) {
            if (!s.lastActiveAt) continue;
            activity.push({
              key: `act-${course.id}-${s.id}`,
              kind: 'activity',
              courseId: course.id,
              courseCode: course.code,
              title: s.name,
              subtitle: `Active in ${course.code}`,
              href: `/teacher/courses/${course.id}/students/${s.id}`,
              meta: relativeTime(s.lastActiveAt),
            });
          }
        }

        needsMark.sort((a, b) => (b.meta || '').localeCompare(a.meta || ''));
        upcoming.sort((a, b) => (a.meta || '').localeCompare(b.meta || ''));
        activity.sort((a, b) => (a.meta || '').localeCompare(b.meta || ''));
        setQueue([...needsMark.slice(0, 5), ...upcoming.slice(0, 4), ...activity.slice(0, 5)]);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentCourses = courses.filter((c) => c.status === 'CURRENT') as ShelfCourse[];
  const pastCourses = courses.filter((c) => c.status === 'PAST') as ShelfCourse[];

  const totalStudents = currentCourses.reduce((n, c) => n + (c.studentCount || 0), 0);
  const totalAssessments = currentCourses.reduce((n, c) => n + (c.assessmentCount || 0), 0);
  const footerStats =
    currentCourses.length > 0
      ? `${totalStudents} students · ${totalAssessments} assessments across open courses`
      : undefined;

  const firstName = (() => {
    const parts = (user?.name || '').trim().split(/\s+/).filter(Boolean);
    const titles = new Set(['dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'prof', 'prof.']);
    const filtered = parts.filter((p) => !titles.has(p.toLowerCase()));
    return filtered[0] || parts[0] || 'there';
  })();
  const greet = useMemo(() => greetingForHour(new Date().getHours()), []);
  const termLabel = currentCourses[0]?.term || pastCourses[0]?.term || '';

  const shelfCourses = [...currentCourses, ...pastCourses].map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    href: `/teacher/courses/${c.id}`,
  }));

  const needsMarking = queue.filter((q) => q.kind === 'mark');
  const upcoming = queue.filter((q) => q.kind === 'due');
  const recent = queue.filter((q) => q.kind === 'activity');

  if (isLoading) {
    return (
      <LibraryShell showHeader={false} contentClassName="!max-w-none px-6 sm:px-10 py-8">
        <PageSkeleton />
      </LibraryShell>
    );
  }

  if (error) {
    return (
      <LibraryShell>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-lg" role="alert">
          {error}
        </div>
      </LibraryShell>
    );
  }

  return (
    <LibraryShell
      showHeader={false}
      shelfCourses={shelfCourses}
      contentClassName="!max-w-none px-6 sm:px-10 py-8 lg:py-10"
    >
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="font-serif text-[36px] sm:text-[40px] tracking-[0.01em] text-ink">
            {greet}, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            {courses.length} courses{termLabel ? ` · Term ${termLabel}` : ''}
          </p>
        </div>
        <button type="button" className="folio-btn-primary">
          + New assessment
        </button>
      </div>

      <CourseShelf
        current={currentCourses}
        past={pastCourses}
        basePath="/teacher/courses"
        showNewSlot
        footerStats={footerStats}
        nextUp={needsMarking[0] ? {
          title: needsMarking[0].title,
          subtitle: needsMarking[0].subtitle,
          href: needsMarking[0].href,
          meta: needsMarking[0].meta,
          courseCode: needsMarking[0].courseCode,
        } : undefined}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QueueCard
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="NEEDS MARKING"
          empty="You're caught up — nothing waiting to mark."
          items={needsMarking}
        />
        <QueueCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="UPCOMING DEADLINES"
          empty="No open due dates on your current courses."
          items={upcoming}
        />
        <QueueCard
          icon={<Inbox className="h-4 w-4" />}
          label="RECENT ACTIVITY"
          empty="Student activity will show up here."
          items={recent}
        />
      </div>
    </LibraryShell>
  );
}

function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Date.now() - t;
  const h = Math.round(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function QueueCard({
  icon,
  label,
  empty,
  items,
}: {
  icon: ReactNode;
  label: string;
  empty: string;
  items: QueueItem[];
}) {
  return (
    <section className="folio-card p-5 min-h-[200px] flex flex-col">
      <div className="folio-section-label mb-3 flex items-center gap-1.5">
        <span className="text-[#999]">{icon}</span>
        {label}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ink-subtle leading-relaxed flex-1 flex items-center">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2 flex-1">
          {items.slice(0, 4).map((item) => (
            <li key={item.key}>
              <Link
                to={item.href}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAF8] focus-visible:bg-[#FAFAF8]"
              >
                <span
                  className="w-1.5 h-8 rounded-full shrink-0 mt-0.5"
                  style={{ background: spineColor(item.courseCode) }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-ink truncate">{item.title}</span>
                  <span className="block text-[12px] text-ink-subtle truncate">{item.subtitle}</span>
                </span>
                {item.meta && (
                  <span className="text-[12px] font-semibold text-[#0F6B3E] shrink-0">{item.meta}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
