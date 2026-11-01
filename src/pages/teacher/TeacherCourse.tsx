import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LibraryShell } from '@/components/bookshelf';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { getAuthHeaders } from '@/lib/auth/AuthContext';
import { spineColor } from '@/lib/bookshelf/spineColors';
import { showToast } from '@/lib/toast';

interface Student {
  id: string;
  name: string;
  email: string;
  attemptCount: number;
  lastActiveAt: string | null;
}

interface Assessment {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  effectiveClosed: boolean;
  dueAt: string | null;
  closeAtDue: boolean;
  pdfBlobUrl: string | null;
  pdfFileName: string | null;
  attemptCount: number;
  markedCount: number;
}

interface CourseDetails {
  id: string;
  code: string;
  title: string;
  term: string;
  students: Student[];
  assessments: Assessment[];
}

export function TeacherCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'assessments'>('students');

  useEffect(() => {
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}`, {
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

  const handleToggleStatus = async (assessmentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const response = await fetch(`/api/teacher/assessments/${assessmentId}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update assessment');
      showToast(newStatus === 'OPEN' ? 'Assessment reopened' : 'Assessment closed', 'success');
      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showToast('Could not update assessment', 'error');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
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
        <PageSkeleton rows={4} />
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
          href: `/teacher/courses/${course.id}`,
        },
      ]}
      activeCourseId={course.id}
      showHeader={false}
      contentClassName="!max-w-5xl"
    >
      <nav className="flex items-center gap-2 text-sm text-ink-muted mb-6">
        <Link to="/teacher/home" className="hover:text-ink">
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
            <div className="text-sm text-ink-muted mt-1">
              {course.term} · {course.students.length} students · {course.assessments.length} assessments
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-1 border-b border-[#E8E6E1] mb-5" role="tablist">
        {(
          [
            ['students', `Students (${course.students.length})`],
            ['assessments', `Assessments (${course.assessments.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === id
                ? 'border-ink text-ink'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'students' && (
        <section>
          {course.students.length === 0 ? (
            <div className="folio-card p-10 text-center text-sm text-ink-muted">
              No students enrolled yet.
            </div>
          ) : (
            <div className="folio-card overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="bg-[#FAFAF8]">
                  <tr>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-[0.06em] text-ink-subtle">
                      NAME
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-[0.06em] text-ink-subtle">
                      EMAIL
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-[0.06em] text-ink-subtle">
                      ATTEMPTS
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-[0.06em] text-ink-subtle">
                      LAST ACTIVE
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E1]">
                  {course.students.map((student) => (
                    <tr key={student.id} className="hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3.5 font-semibold text-ink text-sm">{student.name}</td>
                      <td className="px-4 py-3.5 text-ink-muted text-sm">{student.email}</td>
                      <td className="px-4 py-3.5 text-ink-muted text-sm">{student.attemptCount}</td>
                      <td className="px-4 py-3.5 text-ink-muted text-sm">{formatDate(student.lastActiveAt)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/teacher/courses/${courseId}/students/${student.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:underline"
                        >
                          Progress <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === 'assessments' && (
        <section>
          {course.assessments.length === 0 ? (
            <div className="folio-card p-10 text-center text-sm text-ink-muted">
              No assessments yet. Create one from the home shelf.
            </div>
          ) : (
            <div className="folio-card divide-y divide-[#E8E6E1]">
              {course.assessments.map((assessment) => (
                <div key={assessment.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                      <h3 className="font-semibold text-ink">{assessment.title}</h3>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          assessment.effectiveClosed ? 'pill-closed' : 'pill-open'
                        }`}
                      >
                        {assessment.effectiveClosed ? 'Closed' : 'Open'}
                      </span>
                      {assessment.closeAtDue && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F2EE] text-ink-subtle">
                          Auto-close
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-muted">
                      <span>Due {formatDate(assessment.dueAt)}</span>
                      <span>
                        {assessment.attemptCount} attempt{assessment.attemptCount === 1 ? '' : 's'}
                      </span>
                      <span>{assessment.markedCount} marked</span>
                      {assessment.pdfBlobUrl && (
                        <a
                          href={assessment.pdfBlobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-ink hover:underline"
                        >
                          {assessment.pdfFileName || 'View PDF'}
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(assessment.id, assessment.status)}
                    className={
                      assessment.status === 'OPEN'
                        ? 'folio-btn-secondary !text-[#B93232]'
                        : 'folio-btn-primary'
                    }
                  >
                    {assessment.status === 'OPEN' ? 'Close' : 'Reopen'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </LibraryShell>
  );
}
