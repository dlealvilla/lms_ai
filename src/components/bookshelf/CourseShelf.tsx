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

export type NextUp = {
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
  courseCode?: string;
};

interface CourseShelfProps {
  current: ShelfCourse[];
  past: ShelfCourse[];
  basePath: '/teacher/courses' | '/student/courses';
  showNewSlot?: boolean;
  footerStats?: string;
  featuredId?: string;
  nextUp?: NextUp;
}

export function CourseShelf({
  current,
  past,
  basePath,
  showNewSlot = false,
  footerStats,
  featuredId,
  nextUp,
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
      <div className="folio-card p-12 text-center">
        <div className="font-serif text-2xl text-ink mb-2">Your shelf is empty</div>
        <p className="text-sm text-ink-muted max-w-sm mx-auto">
          Courses you teach or enroll in will appear here with colour spines and progress at a glance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr_1fr] gap-4">
        {featured && (
          <CourseCard
            course={featured}
            href={`${basePath}/${featured.id}`}
            featured
            nextUp={nextUp}
            className="md:row-span-2"
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
          <button
            type="button"
            className="folio-card border-dashed p-5 flex items-center justify-center text-sm font-semibold text-ink-subtle hover:bg-[#FAFAF8] hover:text-ink min-h-[96px]"
          >
            + New course
          </button>
        )}
        {others.length > 2 && (
          <div className="md:col-span-2 folio-card p-5">
            <div className="folio-section-label mb-3">MORE ON THE SHELF</div>
            <div className="flex flex-col gap-1">
              {others.slice(2).map((c) => (
                <Link
                  key={c.id}
                  to={`${basePath}/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAF8]"
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
        <div className="flex flex-wrap justify-between gap-2 text-xs text-ink-subtle px-0.5">
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
  nextUp,
}: {
  course: ShelfCourse;
  href: string;
  featured?: boolean;
  muted?: boolean;
  className?: string;
  nextUp?: NextUp;
}) {
  const color = spineColor(course.code);
  const isOpen = course.status === 'CURRENT';

  return (
    <article
      className={cn(
        'folio-card p-5 hover:shadow-md transition-shadow',
        muted && 'opacity-70',
        featured && 'p-6',
        className,
      )}
    >
      <Link
        to={href}
        className="block rounded-lg focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        <div className="flex items-start gap-2.5 mb-3">
          <span
            className="w-2 rounded-lg shrink-0 mt-1"
            style={{ height: featured ? 48 : 36, background: color }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-bold tracking-[0.06em]" style={{ color }}>
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
            <div className={cn('font-serif text-ink mt-1', featured ? 'text-[22px] leading-snug' : 'text-lg')}>
              {course.title}
            </div>
          </div>
        </div>
        <div className="text-[13px] text-ink-muted">
          {[
            course.term,
            course.studentCount != null ? `${course.studentCount} students` : null,
            course.assessmentCount != null ? `${course.assessmentCount} assessments` : null,
          ]
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
      {featured && nextUp && (
        <div className="mt-5 border-t border-[#E8E6E1] pt-4">
          <div className="folio-section-label mb-2.5">NEXT UP</div>
          <Link
            to={nextUp.href}
            className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#FAFAF8] rounded-lg hover:bg-[#F3F2EE]"
          >
            <div className="min-w-0">
              <div className="font-semibold text-[14px] truncate">{nextUp.title}</div>
              <div className="text-[12px] text-[#888] truncate">{nextUp.subtitle}</div>
            </div>
            {nextUp.meta && (
              <span className="text-[13px] font-bold text-[#0F6B3E] shrink-0">{nextUp.meta}</span>
            )}
          </Link>
        </div>
      )}
    </article>
  );
}
