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

interface AttemptData {
  id: string;
  state: AssessmentSession | null;
  mark: number | null;
  lastSavedAt: string | null;
}

export function StudentAssessment() {
  const { courseId, assessmentId } = useParams<{ courseId: string; assessmentId: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentId) {
      fetchAssessmentAndAttempt();
    }
  }, [assessmentId]);

  const fetchAssessmentAndAttempt = async () => {
    try {
      const response = await fetch(`/api/student/assessments/${assessmentId}/attempt`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load assessment');
      }

      const data = await response.json();
      setAssessment(data.assessment);
      setAttempt(data.attempt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutosave = useCallback(async (session: AssessmentSession) => {
    if (!assessmentId) return;

    try {
      const response = await fetch(`/api/student/assessments/${assessmentId}/attempt/autosave`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: session }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.effectiveClosed) {
          // Refresh to show closed state
          fetchAssessmentAndAttempt();
        }
        throw new Error(data.message || 'Autosave failed');
      }
    } catch (err) {
      console.error('Autosave error:', err);
      throw err;
    }
  }, [assessmentId]);

  const handleBack = () => {
    navigate(`/student/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading assessment...</div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Assessment not found'}
        </div>
      </div>
    );
  }

  // Create initial session from attempt state or empty
  const initialSession: AssessmentSession = attempt?.state || {
    assessmentId: assessmentId!,
    documentContent: null,
    chatHistory: [],
    insertions: [],
  };

  return (
    <AssessmentWorkspace
      assessmentId={assessmentId!}
      assessmentTitle={assessment.title}
      mode="student"
      readOnly={assessment.effectiveClosed}
      effectiveClosed={assessment.effectiveClosed}
      initialSession={initialSession}
      onAutosave={assessment.effectiveClosed ? undefined : handleAutosave}
      mark={attempt?.mark}
      pdfUrl={assessment.pdfBlobUrl}
      pdfFileName={assessment.pdfFileName}
      onBack={handleBack}
    />
  );
}

