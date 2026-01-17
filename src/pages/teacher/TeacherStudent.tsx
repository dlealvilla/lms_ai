import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { getAuthHeaders } from '../../lib/auth/AuthContext';

interface AssessmentAttempt {
  assessmentId: string;
  assessmentTitle: string;
  effectiveClosed: boolean;
  hasAttempt: boolean;
  lastSavedAt: string | null;
  mark: number | null;
}

interface StudentDetails {
  id: string;
  name: string;
  email: string;
  attempts: AssessmentAttempt[];
}

interface CourseInfo {
  id: string;
  code: string;
  title: string;
}

export function TeacherStudent() {
  const { courseId, studentId } = useParams<{ courseId: string; studentId: string }>();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markInputs, setMarkInputs] = useState<Record<string, string>>({});
  const [savingMarks, setSavingMarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (courseId && studentId) {
      fetchStudentDetails();
    }
  }, [courseId, studentId]);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`/api/teacher/courses/${courseId}/students/${studentId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }

      const data = await response.json();
      setStudent(data.student);
      setCourse(data.course);
      
      // Initialize mark inputs
      const marks: Record<string, string> = {};
      data.student.attempts.forEach((a: AssessmentAttempt) => {
        marks[a.assessmentId] = a.mark?.toString() ?? '';
      });
      setMarkInputs(marks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMark = async (assessmentId: string) => {
    const markValue = parseInt(markInputs[assessmentId], 10);
    
    if (isNaN(markValue) || markValue < 0 || markValue > 100) {
      alert('Mark must be an integer between 0 and 100');
      return;
    }

    setSavingMarks(prev => ({ ...prev, [assessmentId]: true }));

    try {
      const response = await fetch(
        `/api/teacher/students/${studentId}/assessments/${assessmentId}/mark`,
        {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mark: markValue }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save mark');
      }

      // Refresh data
      fetchStudentDetails();
    } catch (err) {
      console.error('Failed to save mark:', err);
      alert('Failed to save mark');
    } finally {
      setSavingMarks(prev => ({ ...prev, [assessmentId]: false }));
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
          <div className="text-gray-500">Loading student details...</div>
        </div>
      </AuthLayout>
    );
  }

  if (error || !student || !course) {
    return (
      <AuthLayout>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Student not found'}
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
          <Link to={`/teacher/courses/${courseId}`} className="hover:text-gray-700">
            {course.code}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{student.name}</span>
        </div>

        {/* Student header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{student.name}</h1>
          <div className="text-gray-500">{student.email}</div>
        </div>

        {/* Assessments list */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessments</h2>
          
          {student.attempts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              No assessments for this course
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 divide-y">
              {student.attempts.map((attempt) => (
                <div key={attempt.assessmentId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {attempt.assessmentTitle}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            attempt.effectiveClosed
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {attempt.effectiveClosed ? 'Closed' : 'Open'}
                        </span>
                        {!attempt.hasAttempt && (
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            Not started
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Last saved: {formatDate(attempt.lastSavedAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Mark input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={markInputs[attempt.assessmentId] || ''}
                          onChange={(e) => setMarkInputs(prev => ({
                            ...prev,
                            [attempt.assessmentId]: e.target.value,
                          }))}
                          placeholder="0-100"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          disabled={!attempt.hasAttempt}
                        />
                        <button
                          onClick={() => handleSaveMark(attempt.assessmentId)}
                          disabled={!attempt.hasAttempt || savingMarks[attempt.assessmentId]}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          {savingMarks[attempt.assessmentId] ? '...' : 'Save'}
                        </button>
                      </div>

                      {/* View attempt link */}
                      {attempt.hasAttempt && (
                        <Link
                          to={`/teacher/courses/${courseId}/students/${studentId}/assessments/${attempt.assessmentId}`}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AuthLayout>
  );
}

