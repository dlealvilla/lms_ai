import { useState } from 'react';
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

/**
 * AttemptAnalytics Page
 * 
 * Renders analytics for one student × one assessment attempt.
 * This is a wireframe-first implementation with placeholder data.
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

  // Log params for debugging (these will be used for data fetching later)
  console.log('Analytics params:', { courseId, studentId, assessmentId });

  const handleBack = () => {
    navigate(`/teacher/courses/${courseId}/students/${studentId}/assessments/${assessmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with breadcrumb, title, and actions */}
      <StickyHeader
        onBack={handleBack}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* Main scrollable content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Section 1: High-Level Summary */}
        <ScoreSummaryCards />

        {/* Section 2: Detailed Breakdown */}
        <BreakdownSection />

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
