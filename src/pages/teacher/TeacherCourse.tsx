import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { getAuthHeaders } from '../../lib/auth/AuthContext';

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
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}`, {
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

      if (!response.ok) {
        throw new Error('Failed to update assessment');
      }

      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to toggle status:', err);
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
          <Link to="/teacher/home" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">{course.code}</span>
        </div>

        {/* Course header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-purple-600 font-medium mb-1">{course.code}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <div className="text-gray-500">{course.term}</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-2 px-1 font-medium ${
              activeTab === 'students'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Students ({course.students.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`pb-2 px-1 font-medium ${
              activeTab === 'assessments'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assessments ({course.assessments.length})
          </button>
        </div>

        {/* Students tab */}
        {activeTab === 'students' && (
          <section>
            {course.students.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No students enrolled
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Attempts</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Last Active</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {course.students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-gray-600">{student.email}</td>
                        <td className="px-4 py-3 text-gray-600">{student.attemptCount}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {formatDate(student.lastActiveAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/teacher/courses/${courseId}/students/${student.id}`}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            View Progress →
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

        {/* Assessments tab */}
        {activeTab === 'assessments' && (
          <section className="space-y-4">
            {course.assessments.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No assessments yet
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 divide-y">
                {course.assessments.map((assessment) => (
                  <div key={assessment.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              assessment.effectiveClosed
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {assessment.effectiveClosed ? 'Closed' : 'Open'}
                          </span>
                          {assessment.closeAtDue && (
                            <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">
                              Auto-close
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Due: {formatDate(assessment.dueAt)}</span>
                          <span>{assessment.attemptCount} attempts</span>
                          <span>{assessment.markedCount} marked</span>
                          {assessment.pdfBlobUrl && (
                            <a
                              href={assessment.pdfBlobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              📄 {assessment.pdfFileName || 'View PDF'}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(assessment.id, assessment.status)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            assessment.status === 'OPEN'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {assessment.status === 'OPEN' ? 'Close' : 'Reopen'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </AuthLayout>
  );
}

