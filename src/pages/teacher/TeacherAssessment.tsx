import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentWorkspace } from '../../components/AssessmentWorkspace/AssessmentWorkspace';
import { getAuthHeaders } from '../../lib/auth/AuthContext';
import type { AssessmentSession } from '../../types/assessment';

interface AssessmentDetails {
  id: string;
  title: string;
  effectiveClosed: boolean;
  pdfBlobUrl: string | null;
  pdfFileName: string | null;
}

interface StudentInfo {
  id: string;
  name: string;
  email: string;
}

interface AttemptData {
  id: string;
  state: AssessmentSession | null;
  mark: number | null;
  lastSavedAt: string | null;
}

export function TeacherAssessment() {
  const { courseId, studentId, assessmentId } = useParams<{
    courseId: string;
    studentId: string;
    assessmentId: string;
  }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId && assessmentId) {
      fetchData();
    }
  }, [studentId, assessmentId]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/students/${studentId}/assessments/${assessmentId}/attempt`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load student attempt');
      }

      const data = await response.json();
      setAssessment(data.assessment);
      setStudent(data.student);
      setAttempt(data.attempt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetMark = useCallback(async (mark: number) => {
    try {
      const response = await fetch(
        `/api/teacher/students/${studentId}/assessments/${assessmentId}/mark`,
        {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mark }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save mark');
      }

      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Failed to save mark:', err);
      throw err;
    }
  }, [studentId, assessmentId]);

  const handleBack = () => {
    navigate(`/teacher/courses/${courseId}/students/${studentId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading student attempt...</div>
      </div>
    );
  }

  if (error || !assessment || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Attempt not found'}
        </div>
      </div>
    );
  }

  // Create session from attempt state or empty
  const initialSession: AssessmentSession = attempt?.state || {
    assessmentId: assessmentId!,
    documentContent: null,
    chatHistory: [],
    insertions: [],
  };

  return (
    <AssessmentWorkspace
      assessmentId={assessmentId!}
      assessmentTitle={`${assessment.title} — ${student.name}`}
      mode="teacher"
      readOnly={true}
      effectiveClosed={assessment.effectiveClosed}
      initialSession={initialSession}
      mark={attempt?.mark}
      onSetMark={handleSetMark}
      pdfUrl={assessment.pdfBlobUrl}
      pdfFileName={assessment.pdfFileName}
      onBack={handleBack}
    />
  );
}

