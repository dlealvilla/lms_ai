import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { getAuthHeaders } from '../../lib/auth/AuthContext';

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
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/student/courses/${courseId}/assessments`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

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
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-ink-muted">Loading course...</div>
        </div>
      </AuthLayout>
    );
  }

  if (error || !course) {
    return (
      <AuthLayout>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-lg">
          {error || 'Course not found'}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Link to="/student/home" className="hover:text-ink">Home</Link>
          <span>/</span>
          <span className="text-ink">{course.code}</span>
        </div>

        {/* Course header */}
        <div className="bg-white rounded-xl border shadow-folio border-[#E8E6E1] p-6">
          <div className="text-sm text-[#2D4A6B] font-medium mb-1">{course.code}</div>
          <h1 className="font-serif text-3xl tracking-[-0.02em] text-ink mb-2">{course.title}</h1>
          <div className="text-ink-muted">{course.term}</div>
        </div>

        {/* Assessments */}
        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">Assessments</h2>
          
          {course.assessments.length === 0 ? (
            <div className="bg-page-muted rounded-lg p-8 text-center text-ink-muted">
              No assessments yet
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-folio border-[#E8E6E1] divide-y">
              {course.assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  to={`/student/courses/${courseId}/assessments/${assessment.id}`}
                  className="block p-4 hover:bg-page-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-ink">
                          {assessment.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            assessment.effectiveClosed
                              ? 'bg-error/10 text-error border border-error/30'
                              : 'bg-success/10 text-success border border-success/30'
                          }`}
                        >
                          {assessment.effectiveClosed ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-ink-muted">
                        {assessment.dueAt && (
                          <span>Due: {formatDate(assessment.dueAt)}</span>
                        )}
                        {assessment.attempt?.lastSavedAt && (
                          <span>Last saved: {formatDate(assessment.attempt.lastSavedAt)}</span>
                        )}
                        {assessment.pdfBlobUrl && (
                          <span className="text-[#2D4A6B]">📄 PDF available</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {assessment.attempt?.mark !== null && assessment.attempt?.mark !== undefined ? (
                        <span className="px-3 py-1 bg-ink/20 text-ink border border-ink rounded-lg font-medium">
                          {assessment.attempt.mark}/100
                        </span>
                      ) : (
                        <span className="text-ink-subtle">—</span>
                      )}
                      <span className="text-ink-subtle">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AuthLayout>
  );
}

