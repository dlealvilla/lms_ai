import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  StickyHeader,
  ScoreSummaryCards,
  BreakdownSection,
  TraceControlsBar,
  PromptAnalysisSection,
  NotesDrawer,
  MiniNav,
} from './components';
import { getAnalyticsData, type AnalyticsData } from './mockAnalyticsData';

/**
 * Educator-only attempt analytics.
 * Scores today are a sample-data preview — not computed from real attempts.
 * Route: /teacher/courses/:courseId/students/:studentId/assessments/:assessmentId/analytics
 */
export function AttemptAnalytics() {
  const { courseId, studentId, assessmentId } = useParams<{
    courseId: string;
    studentId: string;
    assessmentId: string;
  }>();
  const navigate = useNavigate();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setAnalyticsData(getAnalyticsData(studentId));
  }, [studentId]);

  const handleBack = () => {
    navigate(
      `/teacher/courses/${courseId}/students/${studentId}/assessments/${assessmentId}`,
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-ink">
      <StickyHeader
        data={analyticsData}
        onBack={handleBack}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <ScoreSummaryCards data={analyticsData} />
        <BreakdownSection data={analyticsData} />
        <TraceControlsBar />
        <PromptAnalysisSection />
      </main>

      <MiniNav />

      <NotesDrawer isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
}
