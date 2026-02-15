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
 * AttemptAnalytics Page
 * 
 * Renders analytics for one student × one assessment attempt.
 * Uses mock data for demonstration, ready for real data integration.
 * 
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

  // Load analytics data based on student ID
  useEffect(() => {
    // In production, this would fetch from an API
    // For now, we use mock data based on student ID
    const data = getAnalyticsData(studentId);
    setAnalyticsData(data);
  }, [studentId]);

  const handleBack = () => {
    navigate(`/teacher/courses/${courseId}/students/${studentId}/assessments/${assessmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with breadcrumb, title, and actions */}
      <StickyHeader
        data={analyticsData}
        onBack={handleBack}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* Main scrollable content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Section 1: High-Level Summary */}
        <ScoreSummaryCards data={analyticsData} />

        {/* Section 2: Detailed Breakdown */}
        <BreakdownSection data={analyticsData} />

        {/* Section 3: Evidence & Trace Navigation */}
        <TraceControlsBar />

        {/* Section 4: Prompt-Level Analysis */}
        <PromptAnalysisSection />
      </main>

      {/* Floating mini-nav (desktop only) */}
      <MiniNav />

      {/* Notes Drawer */}
      <NotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </div>
  );
}
