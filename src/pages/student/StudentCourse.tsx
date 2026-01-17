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
          <div className="text-gray-500">Loading course...</div>
        </div>
      </AuthLayout>
    );
  }

  if (error || !course) {
    return (
      <AuthLayout>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Course not found'}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/student/home" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">{course.code}</span>
        </div>

        {/* Course header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-blue-600 font-medium mb-1">{course.code}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <div className="text-gray-500">{course.term}</div>
        </div>

        {/* Assessments */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessments</h2>
          
          {course.assessments.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              No assessments yet
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 divide-y">
              {course.assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  to={`/student/courses/${courseId}/assessments/${assessment.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {assessment.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            assessment.effectiveClosed
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {assessment.effectiveClosed ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {assessment.dueAt && (
                          <span>Due: {formatDate(assessment.dueAt)}</span>
                        )}
                        {assessment.attempt?.lastSavedAt && (
                          <span>Last saved: {formatDate(assessment.attempt.lastSavedAt)}</span>
                        )}
                        {assessment.pdfBlobUrl && (
                          <span className="text-blue-600">📄 PDF available</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {assessment.attempt?.mark !== null && assessment.attempt?.mark !== undefined ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {assessment.attempt.mark}/100
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                      <span className="text-gray-400">→</span>
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

