import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { spineColor } from '@/lib/bookshelf/spineColors';

export interface ShelfCourse {
  id: string;
  code: string;
  title: string;
  term?: string;
  status: 'CURRENT' | 'PAST';
  studentCount?: number;
  assessmentCount?: number;
}

interface CourseShelfProps {
  current: ShelfCourse[];
  past: ShelfCourse[];
  basePath: '/teacher/courses' | '/student/courses';
  showNewSlot?: boolean;
  footerStats?: string;
  featuredId?: string;
}

export function CourseShelf({
  current,
  past,
  basePath,
  showNewSlot = false,
  footerStats,
  featuredId,
}: CourseShelfProps) {
  const all = [...current, ...past];
  const featured =
    all.find((c) => c.id === featuredId) ||
    current[0] ||
    all[0] ||
    null;
  const others = all.filter((c) => !featured || c.id !== featured.id);

  if (all.length === 0) {
    return (
      <div className="bg-white border border-[#E8E6E1] rounded-xl p-12 text-center text-ink-muted">
        No courses on your shelf yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured && (
          <CourseCard
            course={featured}
            href={`${basePath}/${featured.id}`}
            featured
            className="md:col-span-1 md:row-span-2"
          />
        )}
        {others.slice(0, 2).map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            href={`${basePath}/${c.id}`}
            muted={c.status === 'PAST'}
          />
        ))}
        {showNewSlot && (
          <div className="bg-white border border-dashed border-[#E8E6E1] rounded-xl p-5 flex items-center justify-center text-sm font-semibold text-ink-subtle">
            + New course
          </div>
        )}
        {others.length > 2 && (
          <div className="md:col-span-2 bg-white border border-[#E8E6E1] rounded-xl p-5 shadow-folio">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[#999] mb-3">
              MORE ON THE SHELF
            </div>
            <div className="flex flex-col gap-2">
              {others.slice(2).map((c) => (
                <Link
                  key={c.id}
                  to={`${basePath}/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#FAFAF8]"
                >
                  <span
                    className="w-2 h-8 rounded-lg shrink-0"
                    style={{ background: spineColor(c.code) }}
                  />
                  <span className="text-[12px] font-bold" style={{ color: spineColor(c.code) }}>
                    {c.code}
                  </span>
                  <span className="font-serif text-base text-ink">{c.title}</span>
                  <span className="ml-auto text-xs text-ink-subtle">{c.term}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {(footerStats || current[0]?.term) && (
        <div className="flex flex-wrap justify-between gap-2 text-xs text-ink-subtle">
          <span>{current[0]?.term ? `Current term · ${current[0].term}` : ''}</span>
          {footerStats && <span>{footerStats}</span>}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  href,
  featured,
  muted,
  className,
}: {
  course: ShelfCourse;
  href: string;
  featured?: boolean;
  muted?: boolean;
  className?: string;
}) {
  const color = spineColor(course.code);
  const isOpen = course.status === 'CURRENT';

  return (
    <Link
      to={href}
      className={cn(
        'block bg-white border border-[#E8E6E1] rounded-xl p-5 shadow-folio transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ink',
        muted && 'opacity-70',
        featured && 'p-6',
        className,
      )}
    >
      <div className="flex items-start gap-2.5 mb-3">
        <span
          className="w-2 rounded-lg shrink-0 mt-1"
          style={{ height: featured ? 48 : 36, background: color }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[12px] font-bold tracking-[0.06em]"
              style={{ color }}
            >
              {course.code}
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ml-auto',
                isOpen ? 'pill-open' : 'pill-closed',
              )}
            >
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className={cn('font-serif text-ink mt-1', featured ? 'text-[22px]' : 'text-lg')}>
            {course.title}
          </div>
        </div>
      </div>
      <div className="text-[13px] text-ink-muted">
        {[course.term, course.studentCount != null ? `${course.studentCount} students` : null, course.assessmentCount != null ? `${course.assessmentCount} assessments` : null]
          .filter(Boolean)
          .join(' · ')}
      </div>
      {featured && course.assessmentCount != null && course.assessmentCount > 0 && (
        <div className="mt-4">
          <div className="h-1.5 bg-[#F3F2EE] rounded-full overflow-hidden mb-1.5">
            <div className="h-full rounded-full" style={{ width: '68%', background: color }} />
          </div>
          <div className="text-[12px] text-ink-subtle">Progress across assessments</div>
        </div>
      )}
    </Link>
  );
}
