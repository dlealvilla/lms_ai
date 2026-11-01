import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { LibraryShell } from '@/components/bookshelf';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { getAuthHeaders } from '@/lib/auth/AuthContext';
import { spineColor } from '@/lib/bookshelf/spineColors';

interface Assessment {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  effectiveClosed: boolean;
  dueAt: string | null;
  pdfBlobUrl: string | null;
  pdfFileName: string | null;
  attempt: {
    lastSavedAt: string | null;
    mark: number | null;
  } | null;
}

interface CourseDetails {
  id: string;
  code: string;
  title: string;
  term: string;
  assessments: Assessment[];
}

export function StudentCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/student/courses/${courseId}/assessments`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch course details');
      const data = await response.json();
      setCourse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <LibraryShell>
        <PageSkeleton rows={3} />
      </LibraryShell>
    );
  }

  if (error || !course) {
    return (
      <LibraryShell>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-lg" role="alert">
          {error || 'Course not found'}
        </div>
      </LibraryShell>
    );
  }

  const color = spineColor(course.code);

  return (
    <LibraryShell
      shelfCourses={[
        {
          id: course.id,
          code: course.code,
          title: course.title,
          href: `/student/courses/${course.id}`,
        },
      ]}
      activeCourseId={course.id}
      showHeader={false}
      contentClassName="!max-w-4xl"
    >
      <nav className="flex items-center gap-2 text-sm text-ink-muted mb-6">
        <Link to="/student/home" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink font-medium">{course.code}</span>
      </nav>

      <header className="folio-card p-6 mb-6">
        <div className="flex items-start gap-3">
          <span className="w-2 rounded-lg shrink-0 mt-1" style={{ height: 48, background: color }} aria-hidden />
          <div>
            <div className="text-[12px] font-bold tracking-[0.06em]" style={{ color }}>
              {course.code}
            </div>
            <h1 className="font-serif text-[32px] tracking-[0.01em] text-ink mt-1">{course.title}</h1>
            <div className="text-sm text-ink-muted mt-1">{course.term}</div>
          </div>
        </div>
      </header>

      <section>
        <div className="folio-section-label mb-3">ASSESSMENTS</div>
        {course.assessments.length === 0 ? (
          <div className="folio-card p-10 text-center">
            <FileText className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
            <div className="font-serif text-xl text-ink mb-1">No assessments yet</div>
            <p className="text-sm text-ink-muted">Your teacher hasn&apos;t published any assessments for this course.</p>
          </div>
        ) : (
          <div className="folio-card divide-y divide-[#E8E6E1] overflow-hidden">
            {course.assessments.map((assessment) => (
              <Link
                key={assessment.id}
                to={`/student/courses/${courseId}/assessments/${assessment.id}`}
                className="flex items-center gap-4 p-4 sm:p-5 hover:bg-[#FAFAF8] focus-visible:bg-[#FAFAF8]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3 className="font-semibold text-ink truncate">{assessment.title}</h3>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        assessment.effectiveClosed ? 'pill-closed' : 'pill-open'
                      }`}
                    >
                      {assessment.effectiveClosed ? 'Closed' : 'Open'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-muted">
                    {assessment.dueAt && <span>Due {formatDate(assessment.dueAt)}</span>}
                    {assessment.attempt?.lastSavedAt && (
                      <span>Saved {formatDate(assessment.attempt.lastSavedAt)}</span>
                    )}
                    {assessment.pdfBlobUrl && <span>PDF attached</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {assessment.attempt?.mark != null ? (
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-[12px] font-bold bg-[#E8F6EE] text-[#0F6B3E]">
                      {assessment.attempt.mark}/100
                    </span>
                  ) : assessment.attempt?.lastSavedAt ? (
                    <span className="text-[12px] font-semibold text-ink-subtle">In progress</span>
                  ) : (
                    <span className="text-[12px] text-ink-subtle">Not started</span>
                  )}
                  <ArrowRight className="h-4 w-4 text-ink-subtle" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </LibraryShell>
  );
}
