import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, FileText } from 'lucide-react';
import { LibraryShell, CourseShelf, type ShelfCourse, type NextUp } from '@/components/bookshelf';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { getAuthHeaders, useAuth } from '@/lib/auth/AuthContext';
import { spineColor } from '@/lib/bookshelf/spineColors';

interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  status: 'CURRENT' | 'PAST';
}

type QueueItem = {
  key: string;
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

export function StudentHome() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [upcoming, setUpcoming] = useState<QueueItem[]>([]);
  const [continueWork, setContinueWork] = useState<QueueItem[]>([]);
  const [nextUp, setNextUp] = useState<NextUp | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/student/courses', { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        if (cancelled) return;
        const list: Course[] = data.courses || [];
        setCourses(list);

        const current = list.filter((c) => c.status === 'CURRENT');
        const details = await Promise.all(
          current.slice(0, 6).map(async (c) => {
            try {
              const r = await fetch(`/api/student/courses/${c.id}/assessments`, {
                headers: getAuthHeaders(),
              });
              if (!r.ok) return null;
              const body = await r.json();
              return { course: c, body };
            } catch {
              return null;
            }
          }),
        );
        if (cancelled) return;

        const dueItems: QueueItem[] = [];
        const draftItems: QueueItem[] = [];

        for (const row of details) {
          if (!row) continue;
          const { course, body } = row;
          const assessments = body.assessments || [];
          for (const a of assessments) {
            if (a.effectiveClosed) continue;
            const due = formatDue(a.dueAt);
            const href = `/student/courses/${course.id}/assessments/${a.id}`;
            if (a.dueAt) {
              dueItems.push({
                key: `due-${a.id}`,
                courseId: course.id,
                courseCode: course.code,
                title: a.title,
                subtitle: `${course.code} · due ${due || 'soon'}`,
                href,
                meta: due || undefined,
              });
            }
            if (a.attempt?.lastSavedAt && a.attempt?.mark == null) {
              draftItems.push({
                key: `draft-${a.id}`,
                courseId: course.id,
                courseCode: course.code,
                title: a.title,
                subtitle: `${course.code} · continue draft`,
                href,
                meta: 'In progress',
              });
            } else if (!a.attempt) {
              draftItems.push({
                key: `start-${a.id}`,
                courseId: course.id,
                courseCode: course.code,
                title: a.title,
                subtitle: `${course.code} · not started`,
                href,
                meta: due ? `Due ${due}` : 'Open',
              });
            }
          }
        }

        dueItems.sort((a, b) => (a.meta || '').localeCompare(b.meta || ''));
        setUpcoming(dueItems.slice(0, 5));
        setContinueWork(draftItems.slice(0, 5));
        const primary = draftItems[0] || dueItems[0];
        if (primary) {
          setNextUp({
            title: primary.title,
            subtitle: primary.subtitle,
            href: primary.href,
            meta: primary.meta,
            courseCode: primary.courseCode,
          });
        }
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
    href: `/student/courses/${c.id}`,
  }));

  if (isLoading) {
    return (
      <LibraryShell contentClassName="!max-w-none">
        <PageSkeleton rows={4} />
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
      <div className="mb-8">
        <h1 className="font-serif text-[36px] sm:text-[40px] tracking-[0.01em] text-ink">
          {greet}, {firstName}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          {courses.length} courses{termLabel ? ` · Term ${termLabel}` : ''}
        </p>
      </div>

      {currentCourses.length === 0 && pastCourses.length === 0 ? (
        <div className="folio-card p-12 text-center">
          <div className="font-serif text-2xl text-ink mb-2">Your shelf is empty</div>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            When your teacher enrolls you, courses will appear here with colour spines and due dates.
          </p>
        </div>
      ) : (
        <>
          <CourseShelf
            current={currentCourses}
            past={pastCourses}
            basePath="/student/courses"
            nextUp={nextUp}
            footerStats={
              continueWork.length
                ? `${continueWork.length} open assessment${continueWork.length === 1 ? '' : 's'}`
                : undefined
            }
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <QueueCard
              icon={<FileText className="h-4 w-4" />}
              label="CONTINUE WRITING"
              empty="No drafts in progress — open a course to start."
              items={continueWork}
            />
            <QueueCard
              icon={<CalendarClock className="h-4 w-4" />}
              label="UPCOMING DEADLINES"
              empty="No upcoming due dates on your current courses."
              items={upcoming}
            />
          </div>
        </>
      )}
    </LibraryShell>
  );
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
    <section className="folio-card p-5 min-h-[180px] flex flex-col">
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
